import  { createClient} from "@supabase/supabase-js"
import {nanoid} from "nanoid"

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
)

export default async function handler(req, res){
    if(req.method === "POST"){
        const {originalURL} = req.body;
        const id = nanoid(8)    // nanoid will generate a short ID using nanoid liberary

        const {data, error} = await supabase
            .from("urls")
            .insert([{id, original_url: originalURL}])
            .single();

        if(error){
            res.status(500).json({error: "Failed to create a short URL"})
        } else { 
            const shortURL = `${req.header.host}/${data.id}`;
            res.status(200).json({shortURL})
        }
    } else {
        res.status(405).json({error: "Method not allowed"})
    }
}
