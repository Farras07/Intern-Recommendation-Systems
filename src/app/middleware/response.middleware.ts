import { Success, Failed } from '@/types/ResponseTypes';
import InvariantError from '@/exceptions/InvariantError';

type HandlerFunction = (req: Request, ctx?: any) => Promise<any>;

export default function ResMiddleware(handler: HandlerFunction) {
  return async (req: Request, ctx?: any) => {
    try {
      const result = await handler(req, ctx);

      // If handler returns an object already shaped, just return it
      if (result?.statusCode && result?.message) {
        return Success(result);
      }

      // Otherwise, wrap it nicely
      return Success({
        statusCode: 200,
        message: 'Success',
        data: result,
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode || 500,
        message: error.message || 'Internal Server Error',
      });
    }
  };
}
