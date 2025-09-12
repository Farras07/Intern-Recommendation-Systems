// app/api/roles-sse/route.ts
import { adminDb as db } from '@/lib/firebase-admin';

export const runtime = 'nodejs'; // Make sure this runs on Node.js, not Edge

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send SSE headers
      controller.enqueue(
        encoder.encode('event: connected\ndata: Connected to SSE\n\n'),
      );

      // Ping every 30s
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode('event: ping\ndata: {}\n\n'));
      }, 30000);

      // Firestore listener
      const unsubscribe = db.collection('role').onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        controller.enqueue(
          encoder.encode(
            `event: roles_update\ndata: ${JSON.stringify(data)}\n\n`,
          ),
        );
      });

      // Close connection when client disconnects
      // Note: In App Router, we can't directly use `req.on('close')`
      // SSE will auto-close when browser closes the EventSource
      return () => {
        clearInterval(keepAlive);
        unsubscribe();
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
