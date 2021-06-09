## ORÇAMENTO INTELIGENTE DA PREFEITURA DE SÃO PAULO 2020

Este projeto foi criado por voluntários do Gabinete da Vereadora Janaína Lima. Trata-se de uma ferramenta para visualização e análise de dados do orçamento da prefeitura em 2020 e anos anteriores. A ideia é oferecer maior transparência e simplicidade às contas públicas do munícipio. Este trabalho é uma adaptação da visualização criada pelo grupo italiano g0v.it em https://budget.g0v.it . Utilizamos a api LODMAP2D desenvolvida pela equipe do Linked Data Center.


### Setup do servidor

O primeiro passo para fazer o setup dessa plataforma é baixando os arquivos deste repositório no seu computador. Para fazer isso, escolha uma pasta de arquivos apropriada e rode o seguinte código em seu terminal

```bash
git clone "https://github.com/g0v-br/Orcamento-Inteligente.git"
```

Para os próximos passos será necessário que você tenha Docker instalado em seu computador. Caso você não tenha, instale através desste [link](https://docs.docker.com/install/).
Tendo feito isso, entre no diretório "Orcamento-Inteligente". Ele deve estar disponível para você.

Deste diretório você pode executar o seguinte comando

```bash
docker build -t myloadmap2d -f docker/Dockerfile .
```
E em seguida, o código

```bash
docker run -d -e LODMAP2D_DATA=http://localhost:8080/data.ttl -p 8080:80 myloadmap2d
```

Usando o navegador de sua preferência, vá para o endereço http://localhost:8080

Pronto, você deve enxergar a imagem do servidor!
