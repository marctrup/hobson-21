import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting image upload process...')

    // Define image mappings (local Lovable uploads to Supabase storage)
    const imageUploads = [
      {
        localPath: '/lovable-uploads/3bc4199c-d91b-4abe-b056-e640e89dfb7b.png',
        storagePath: 'too-good-to-be-true.png',
        slug: 'property-management-software'
      },
      {
        localPath: '/lovable-uploads/06d9f7f9-3442-4a01-8c45-47a4548f1214.png',
        storagePath: 'boy-praying-with-bible.png',
        slug: 'tenant-document'
      },
      {
        localPath: '/lovable-uploads/546cc094-7b4f-4c38-a3ad-c26fd3f3db7f.png',
        storagePath: 'deliveroo-bike.png',
        slug: 'real-estate-ai'
      }
    ]

    const results = []

    for (const upload of imageUploads) {
      try {
        console.log(`Processing ${upload.storagePath}...`)
        
        // Fetch the image from the local path
        const imageResponse = await fetch(`https://76b99579-7143-48dc-88c3-0018da03623c.lovableproject.com${upload.localPath}`)
        
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
        }

        const imageBlob = await imageResponse.blob()
        
        // Upload to Supabase storage
        const { data, error } = await Deno.env.get('SUPABASE_URL') 
          ? await (async () => {
              const supabaseUrl = Deno.env.get('SUPABASE_URL')!
              const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
              
              const uploadResponse = await fetch(
                `${supabaseUrl}/storage/v1/object/blog-images/${upload.storagePath}`,
                {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': imageBlob.type,
                  },
                  body: imageBlob,
                }
              )
              
              if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text()
                throw new Error(`Upload failed: ${uploadResponse.statusText} - ${errorText}`)
              }
              
              return { data: { path: upload.storagePath }, error: null }
            })()
          : { data: null, error: new Error('Supabase URL not configured') }

        if (error) {
          throw error
        }

        results.push({
          success: true,
          storagePath: upload.storagePath,
          slug: upload.slug,
          publicUrl: `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/blog-images/${upload.storagePath}`
        })

        console.log(`Successfully uploaded ${upload.storagePath}`)
        
      } catch (error) {
        console.error(`Error uploading ${upload.storagePath}:`, error)
        results.push({
          success: false,
          storagePath: upload.storagePath,
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})