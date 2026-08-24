const express = require("express")
const app = express()
const port = 3000
app.use(express.json()) // configura API para usar JSON.
const fs = require('fs') // importa leitura e escrita de arquivos.

let arquivoID = JSON.parse(fs.readFileSync("id.json", "utf8"))
let id = arquivoID.id 

function atualizarId(){
    id = id + 1
    fs.writeFileSync("id.json", JSON.stringify({id: id}), "utf8")
}

/*    Mostra a lista de aulas       */
app.get("/aulas", (req,res) => {
    try {
        /*     Abrir o arquivo         */
        const bd = JSON.parse(fs.readFileSync("aulas.json", "utf8"))
        res.status(200).json({resposta: bd})
    } catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
})




/* Mostra as aulas de um dia específico */
app.get("/aulas/:dia", (req, res) => {
    const dia = req.params.dia
    try {
        const aulas = JSON.parse(fs.readFileSync("aulas.json", "utf8"))
        const aulasDia = aulas.filter((aula) => aula.dia.toLowerCase() === dia.toLowerCase())

        const ordem = aulasDia.sort((a, b) => a.ordem - b.ordem)

        if (aulasDia.length === 0) {
            return res.status(404).json({erro: "Nenhuma aula encontrada para este dia"})
        }
        res.status(200).json({resposta: aulasDia})
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }
})




/*    Adiciona aula                 */
app.post("/aulas", (req,res) => {
    const aula = req.body
    try {
        /*     Abrir o arquivo         */
        const bd = JSON.parse(fs.readFileSync("aulas.json", "utf8"))
        atualizarId()
        aula.id = id
        /*     adicionar aula     */
        bd.push(aula)
        /*     salvar o arquivo        */
        fs.writeFileSync("aulas.json", JSON.stringify(bd), "utf8")
        /*     Resposta                */
        res.status(201).json({ resposta: "Aula cadastrada com sucesso!" })
    } catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
})


/*    Deleta uma aula da lista      */
app.delete("/aulas/:id", (req,res) => {

    /*     Pegar uma aula da rota            */
    const id = req.params.id
try{
    /*     Abrir o arquivo               */
    const bd = JSON.parse(fs.readFileSync("aulas.json", "utf8"))
    /*     Encontra o indece da aula a ser excluida */
    const indiceAula = bd.findIndex((aula) => aula.id == id)
    /*     Remove o indice da lista      */
    if(indiceAula == -1){
        return res.status(404).json({erro: "Aula não encontrada"})
    }
    bd.splice(indiceAula, 1)
    /*     Atualizar o arquivo           */
    fs.writeFileSync("aulas.json", JSON.stringify(bd), "utf8")
    /*     Dar uma resposta   */
        res.status(200).json({resposta: "Aula removida com sucesso!"})
    }catch(erro){
        res.status(500).json({ erro: erro.message })
    }
})

// Execução da API:
app.listen(port, ()=>{
    console.log("API rodando na porta " + port)
})






/*               GET     -      Ver todas as aulas da semana                -                ​http://localhost:3000/aulas                                                      */
/*               POST    -      Cadastrar aulas no sistema                  -                ​http://localhost:3000/aulas                                                      */
/*               DELETE  -      Deleta uma aula apartir do id               -                ​http://localhost:3000/aulas/ (id da materia que quer excluir)                    */
/*               GET     -      Ver todas as aulas de um dia especifico     -                ​http://localhost:3000/aulas/ (dia que quer ver)                                  */



/*               Instalar extennção RapidAPI Client                                     */
/*               Instalar      npm init    e    npm i express                           */