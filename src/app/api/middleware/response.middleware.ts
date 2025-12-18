import { Success, Failed } from '@/types/ResponseTypes';

type HandlerFunction = (req: Request, ctx?: any) => Promise<any>;

export default function ResMiddleware(handler: HandlerFunction) {
  return async (req: Request, ctx?: any) => {
    try {
      const result = await handler(req, ctx);

      if (result?.statusCode && result?.message) {
        return Success(result);
      }

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
