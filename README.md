![ldc](http://linkeddata.center/resources/v4/logo/Logo-colori-trasp_oriz-640x220.png)
# LODMAP2D

LODMAP2D is a data driven web application to explore a lot of detailed information without loosing the big picture [see overview](https://docs.google.com/presentation/d/e/2PACX-1vRLRVU0fE-nXQhsc-1NVCKmmRW4eYqcFUyDPTRUyyMl6oDhZ137FyTuNLQA1RMRaCUvM7Tb8iHi_qiF/pub?start=false&loop=false&delayms=3000).

LODMAP2D use the SOLID specifications and the Semantic Web standards to ensure an high level of security and privacy on private data. Data can be centralized in a Knowledge Graph or distributed in the net Linked Data

LODMAP2D can be easily customized to match a specific data domain. See for example the [Italian Budget](https://budget.g0v.it) produced by the [g0v.it team](https://github.com/gov-it/) and published by the [Copernicani Association](http://copernicani.it)# LODMAP2D

LODMAP2D è una applicazione per esplorare interattivamente una grande quantità di informazioni senza mai perdere la visione d'insieme [vedi la presentazione](https://docs.google.com/presentation/d/14OPAIxZoxCuwYo7fmso2bL4TAMcFTFO5ryEXhdsOSus/edit?usp=sharing)


## Build and run with node

Be sure to have [node](https://nodejs.org) installed, open a console and type:

```bash
npm install
npm run serve
```

The application will be ready on port 8080

 
## Build and run with docker

The platform is shipped with a [Docker](https://docker.com) setup that makes it easy to get a containerized development environment up and running. 
If you do not already have Docker on your computer, 
[it's the right time to install it](https://docs.docker.com/install/).

To build and run LODMAP2D container:

```bash
docker build -t lodmap2d .
docker run -d --name lodmap2d -p 8080:8080 lodmap2d
```

Try it pointing your browser to http://localhost:8080

Free docker resources with:

```
docker rm -f lodmap2d
```

## Usare LODMAP2D

Le funzioni di LODMAP2D sono richiamabili attraverso un alcune rotte gestite direttamente dalla applicazione, ed in particolare:

| url template | azione |
|------------- |------- |
| /{?s} | visualizza un soggetto di tipo bgo:Overview come un insieme di bolle |
| /table{?s} | visualizza un soggetto di tipo bgo:TableView come tabella |
| /account/{account_id} | visualizza un soggetto di tipo bgo:Account |
| /credits | visualizza la pagina di crediti |
| /terms  visualizza la pagina termini e condizioni |
| /partition/{partition_id}{?s} | visualizza un soggetto di tipo bgo:Partition |


Il parametro opzionale  *s* permette di filtrare nella visualizzazione gli account il cui titolo, la cui descrizione o la cui id contiene, anche parzialmente, la stringa passata come valore al parametro.


## Development

LODMAP2D è una single page application sviluppata nel framework [Vue](https://vuejs.org/) in accordo alle specifiche [SOLID](https://github.com/solid/solid-spec) basata sulla la libreria [Data Driven Document (d3)](https://d3js.org/)

Il modello dei dati adotta il [Resource Description Framework (RDF)](https://www.w3.org/RDF/) e gli standard del [Semanitic Web](https://www.w3.org/standards/semanticweb/data). 

In particolare LODMAP2D in grado di riconoscere le seguenti classi esposte dalla alla [Bubble Graph Ontology](http://linkeddata.center/lodmap-bgo/v1).:

- **bgo:Account** 
- **bgo:Overview**
- **bgo:Partition**
- **bgo:TableView**
- **bgo:Domain**

I dati sono ottenuti attraverso la dereferenziazione delle rotte in accordo con le specifiche Linked Data del Semantic Web e sono gestiti dalla libreria [rdflib](https://github.com/linkeddata/rdflib.js/)

Le regole che sovraintendono alla dereferenziazione delle varie risorse sono
definite nel file [public/config.js](public/config.js).
Nella configurazione di default le regole di dereferenziazione caricano il file
[sample.ttl](public/sample.ttl). Nella directory *doc/config* è possibile trovare alcuni esempi di di configurazione più articolati.

## Security

LODMAP2D è molto rispettosa della privaci degli utenti, non utilizza nessun codice di tracciamente e non fa uso di alcun cookie.

Se le risorse dereferenziate lo richiedono, LODMAP2D si autentica utizzando il [WebID](https://www.w3.org/wiki/WebID) che l'utente ha utilizzato in fase di login (opzionale).

Se l'utente non è autenticato, sono elaborati solo i dati pubblici.

# Personalizzazioni

E' possibile personalizzare l'applicazione sovrascrivendo un insieme di file:

- il file [config.js](config.js) permette di definire da dove vengono presi i dati
- tutti i file contenuti nella directory public:
    - il file index.html può essere personalizzato per inserire snippet di tracciamento (es. google analytics) o css privati, per modificare il titolo della applicazione e i parametri per il SEO.
    - i file favicon* possono essere modificati a piacere così come i loghi
    - il file preview.png* per modificare l'immagine di riferimento nei social
    - il file IE_alert per modificare l'alert a fronte di un browser non compatibile
   

- tutti i template contenuti nella directory custom ed in particolare:
    - il file Credits.vue per personalizzare la pagina di credits
    - il file TermAndConditions.vue  per personalizzare la pagina di termini e condizioni

Per non perdersi la possibilità di aggiornamento del LODMAP2D si consiglia fortemente di non sovrascrivere altri file oltre quelli indicati. L'utilizzo di docker semplifica enormemente le attività di personalizzazione. Vedi un esempio nel progetto https://github.com/g0v-it/web-budget.

## File config.js

Il file config.js permette di specificare alcuni parametri interni della applicazione, il particolare la proprietà *dereferencingRules* permette di specificare una serie di regole con cui riscrivere gli URI al fine della loro dereferenziazione.


Una regola di riscrittura è composta da tre attributi:

- una espressione regolare (*regexp*) che viene applicata all'uri
- un array di template (*targets*) che può riferire gruppi presenti nella regexp. I target sono le risorse che contengono i dati in una delle serializazioni di RDF riconosciute dalla libreria rdflib (e.g. turtle, xml, ntriple, html, etc).
- un valore booleano (*isLast*) che dice se le regole successive devono essere ignorate.

Le regole sono valutate in sequenza. Se nessuna regola è applicabile viene usato il metodo standard di dereferenziazione degli uri.



# Thanks

- [Enrico Fagnoni](https://github.com/ecow),[Miah Mohd Ehtesham](https://github.com/miahmohd), [Leonardo Longhi](https://github.com/LeonardoLonghi) and [Yassine Ouahidi](https://github.com/YassineOuahidi) the webapp code design.
- The [D3.js library](https://d3js.org/)
- [Evan You](http://evanyou.me/) and the [Vue community](https://vuejs.org) for the great framework
- TimBL & LinkedData team for SOLID and [rdflib project](https://github.com/linkeddata/rdflib.js)

## License

Please see [License File](LICENSE) for more information.
