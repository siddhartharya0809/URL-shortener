import { createClient } from "@supabase/supabase-js/dist/module";
import { NextResponse } from "next/server";


// retrieving the key and URL and creating a Supabase clent using createClient() function
const supabase=createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)


// it ensure the original URL shouldn't have any http or https
function getValidURL(url){
    if(url.includes("http://") || url.includes("https://")){
        return url;
    }
    return "https:://" +  url;
}

// this will intercept incoming GET requests and handles the redirection logic based on the ID parameter
export default async function handler(req){
    if(req.method === "GET"){
        // extracting the ID param from the URL path
        let pathname = req.nextUrl.pathname
        let parts = pathname.split("/");
        let id = parts[parts.length - 1]
        try {
            const { data, error } = await supabase
                .from("urls")
                .select("original_url")
                .eq("id", id)
                .single();
            // console.log(data, error);
            if (!error) {
                const shortUrl = data.original_url;
                console.log("SHORT URL", shortUrl)
                return NextResponse.redirect(getValidURL(shortUrl));
            }
        } catch (error) {
            console.log(error.message)
        }
    }
}