import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (url) {
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Redirecting...</title>
            <style>
              body {
                background-color: #333;
                color: #fff
              }
            </style>
            <script>
              if (typeof window !== 'undefined') {
                window.location.href = "${url}";
              }
            </script>
          </head>
          <body>
            <p>Redirecting to ${url}...</p>
          </body>
        </html>
      `,
        {
          status: 200,
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
  } else {
    return new NextResponse('Missing "url" parameter.', { status: 400 });
  }
}
