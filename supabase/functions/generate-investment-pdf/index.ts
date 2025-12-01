import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sectionData } = await req.json();
    
    if (!sectionData) {
      return new Response(
        JSON.stringify({ error: 'Section data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating PDF for section:', sectionData.title);

    // Generate HTML content for the PDF
    const htmlContent = generatePDFHTML(sectionData);
    
    // Use Deno's built-in APIs to generate PDF from HTML
    // For now, we'll return the HTML that can be converted client-side
    // In production, you'd use a PDF generation service or library
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        html: htmlContent,
        title: sectionData.title 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generatePDFHTML(sectionData: any): string {
  const { title, subtitle, pages } = sectionData;
  
  let pagesHTML = '';
  
  pages.forEach((page: any, index: number) => {
    const pageBreak = index < pages.length - 1 ? 'page-break-after: always;' : '';
    
    pagesHTML += `
      <div style="${pageBreak} padding: 40px; ${index === 0 ? '' : 'page-break-before: always;'}">
        <h2 style="color: #1f2937; font-size: 28px; font-weight: 700; margin-bottom: 16px; border-bottom: 3px solid #7c3aed; padding-bottom: 12px;">
          ${page.title}
        </h2>
        
        ${page.content.overview ? `
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #7c3aed;">
            <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0;">
              ${page.content.overview}
            </p>
          </div>
        ` : ''}
        
        ${page.content.sections.map((section: any) => `
          <div style="margin-bottom: 32px;">
            <h3 style="font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">
              ${section.title}
            </h3>
            ${section.subtitle ? `
              <p style="font-size: 16px; font-weight: 600; color: #7c3aed; margin-bottom: 12px;">
                ${section.subtitle}
              </p>
            ` : ''}
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${section.items.map((item: string) => `
                <li style="padding: 8px 0 8px 24px; position: relative; font-size: 14px; line-height: 1.6; color: #4b5563;">
                  <span style="position: absolute; left: 0; color: #7c3aed; font-weight: bold;">•</span>
                  ${item}
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    `;
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #1f2937;
        }
        .cover {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
          color: white;
          text-align: center;
          padding: 60px;
          page-break-after: always;
          break-after: page;
        }
        .cover h1 {
          font-size: 48px;
          margin-bottom: 24px;
          font-weight: 700;
          color: white;
        }
        .cover p {
          font-size: 20px;
          color: white;
          opacity: 0.95;
          max-width: 600px;
        }
        .logo {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 40px;
          letter-spacing: -1px;
        }
        .footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px 40px;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
          background: white;
        }
      </style>
    </head>
    <body>
      <div class="cover">
        <div class="logo">HOBSON AI</div>
        <h1>${title}</h1>
        <p>${subtitle}</p>
        <div style="margin-top: 40px; font-size: 14px; opacity: 0.8;">
          Investment Opportunity Document
        </div>
      </div>
      
      ${pagesHTML}
      
      <div class="footer">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>© ${new Date().getFullYear()} Hobson AI - Confidential Investment Materials</span>
          <span>Generated: ${new Date().toLocaleDateString('en-GB')}</span>
        </div>
      </div>
    </body>
    </html>
  `;
}
