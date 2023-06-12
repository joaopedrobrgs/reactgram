//URL da api:
export const api = "http://localhost:5000/api";

//URL de uploads:
export const uploads = "http://localhost:5000/uploads";

//Configurações globais de requisição:
export const requestConfig = (method, data, token = null, image = null) => {

    //Variável que vai começar vazia e vai ser preenchida conforme a requisição:
    let config;

    //Verificando se tem uma imagem na requisição (nesse caso será enviado um formulário com os dados da imagem e o arquivo de imagem):
    if (image) {
        config = {
            method,
            body: data,
            headers: {}
        }
    }
    //Verificando se o método é DELETE ou se o parâmetro data está vazio:
    else if (method === "DELETE" || data === null) {
        config = {
            method,
            headers: {}
        }
    }
    //A próxima hipótese é a ultima possível, que é quando a requisição possui um conteúdo no body, porém esse conteúdo vem no formato JSON:
    else{
        config = {
            method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }
    }

    //Verificando, por fim, se foi enviado um TOKEN na requisição:
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    //Retornando objeto config;
    return config;

}