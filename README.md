# LODMAP2D

LODMAP2D è una applicazione  per esplorare interattivamente una grande quantità di informazioni senza mai  perdere la visione d'insieme [vedi la presentazione](https://docs.google.com/presentation/d/14OPAIxZoxCuwYo7fmso2bL4TAMcFTFO5ryEXhdsOSus/edit?usp=sharing)

Tecnicamente LODMAP2D è una single page application sviluppata nel framework [Vue](https://vuejs.org/) in accordo alle specifiche [SOLID](https://github.com/solid/solid-spec) e in grado di renderizzare alcuni concetti descritti nella [Bubble Graph Ontology](http://linkeddata.center/lodmap-bgo/v1).

In particolare LODVIEW è in grado di visualizzare soggetti di tipo:

- **bgo:Account** per rappresentare una generica informazione quantitativa storicizzata e visualizzata nelle sue varie prospettive (metadati, storica, drill-down, social, etc)
- **bgo:BigPicture** per visualizzare un insieme di bgo:Account come grafico a bolle, partizioni o come tabella


## Usare LODMAP2D

Le funzioni di LODMAP2D sono richiamabili attraverso un alcune URL gestite direttamente dalla applicazione, ed in particolare:

| url template | azione |
|------------- |------- |
| /{?s} | visualizza un soggetto di tipo bgo:BigPicture come un insieme di bolle |
| /table{?s} | visualizza un soggetto di tipo bgo:TableView come tabella |
| /account/{account_id} | visualizza un soggetto di tipo bgo:Account |
| /credits | visualizza la pagina di crediti |
| /terms  visualizza la pagina termini e condizioni |
| /partition/{partition_id}{?s} | visualizza un soggetto di tipo bgo:Partition |


Il parametro *s* permette di filtrare nella visualizzazione gli account il cui titolo, la cui descrizione o la cui id contiene, anche parzialmente, la stringa passata nel parametro "s".


## dati

Ad ogni pagina è associato un URI:

- **urn:lodmap2d:page:bubbles** che contiene informazioni sulle bolle da visualizzare come blob
- **urn:lodmap2d:page:bubbles:table** che contiene informazioni sulle bolle da visualizzare come tabella
- **urn:lodmap2d:page:bubbles:partition** che contiene informazioni sulle bolle da visualizzare come partizione
- **urn:lodmap2d:page:account/{account id}** che contiene informazioni specifiche per l'account con l'id specificato

I dati necessari al rendering delle varie pagine sono caricati attraverso le regole 
definite nel file public/config.js. Per default sono caricati i dati presenti nel file 
[sample.ttl](sample.ttl).

nella directory *doc/config* è possibile trovare alcuni esempi di di configurazione più articolati.

Se le risorse lo richiedono, LODMAP2D può autenticarsi sugli endpoint attraverso il WebIdd ell'utente.
 

## Using the docker image published on docker hub

The platform is shipped with a [Docker](https://docker.com) setup that makes it easy to get a containerized development environment up and running. 
If you do not already have Docker on your computer, 
[it's the right time to install it](https://docs.docker.com/install/).

LinkedData.Center maintains a set of docker images for LODMAP2D ready to run. 

Try it now with

```bash
docker run -d --name lodmap2d -p 8080:8080 linkeddatacenter/lodmap2d:latest
```

See documentation 
https://hub.docker.com/r/linkeddatacenter/lodmap2d



## Build and run local docker image


To build and run webapp container:

```bash
docker build -t lodmap2d .
docker run -d --name lodmap2d -p 8080:8080 lodmap2d
```

Try it pointing your browser to http://localhost:8080

Free docker resources with:

```
docker rm -f lodmap2d
```

# Personalizzazioni

E' possibile personalizzare l'applicazione sovrascrivendo un insieme di file:

- tutti i file contenuti nella directory public:
   - il file config.js permette di definire da dove vengono presi i dati
   - il file index.html può essere personalizzato per inserire snippet di tracciamento (es. google analytics) o css privati, per modificare il titolo della applicazione e i parametri per il SEO.
   - i file favicon* possono essere modificati a piacere così come i loghi
   - il file preview.png* per modificare l'immagine di riferimento nei social
   - il file IE_alert per modificare l'alert a fronte di un browser non compatibile
   
E' sconsigliato aggiungere file in questa directory.

- tutti i template contenuti nella directory src/custom ed in particolare:
   - il file Credits.vue per personalizzare la pagina di credits
   - il file TermAndConditions.vue  per personalizzare la pagina di termini e condizioni
   - il file BurgerMenu.vue per personalizzare il menu
   - il file SocialSharing.vue
   - il file FooterMenu.vue per personalizzare la barra del footer
   - il file Copyright.vue

Vedi un esempio nel progetto https://github.com/g0v-it/web-budget

Per non perdersi la possibilità di aggiornamento del LODMAP2D si consiglia fortemente di non sovrascrivere altri file oltre quelli indicati. L'utilizzo di docker semplifica enormemente le attività di personalizzazione. Vedi un esempio nel progetto https://github.com/g0v-it/web-budget


# Thanks

- [Enrico Fagnoni](https://github.com/ecow),[Miah Mohd Ehtesham](https://github.com/miahmohd), [Leonardo Longhi](https://github.com/LeonardoLonghi) and [Yassine Ouahidi](https://github.com/YassineOuahidi) the webapp code design.
- The [D3.js library](https://d3js.org/)
- [Evan You](http://evanyou.me/) and the [Vue community](https://vuejs.org) for the great framework
- TimBL & LinkedData team for SOLID and [rdflib project](https://github.com/linkeddata/rdflib.js)

## License

Please see [License File](LICENSE) for more information.
