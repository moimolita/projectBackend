const http=require("http")
const url=require("url")

const app=http.createServer((req, res)=>{

    //console.log(req)
    console.log(req.url)

    const parseUrl=url.parse(req.url, true)
    console.log(parseUrl)

    if(req.url=="/productos"){
        res.end("Productos...!!!")
        return
    }

    if(req.url=="/contactos"){
        res.end("Página de contactos...!!!")
        return
    }

    res.end("Bienvenidos al server online...!!!")
})

app.listen(8080, ()=>{
    console.log('server online...!!!')
})