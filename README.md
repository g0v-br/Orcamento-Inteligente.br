![ldc](http://linkeddata.center/resources/v4/logo/Logo-colori-trasp_oriz-640x220.png)
# LODMAP2D

LODMAP2D is a data driven web application to explore a lot of detailed information without loosing the big picture [see overview](http://bit.ly/lodmap2d_p).

LODMAP2D uses the SOLID specifications and the Semantic Web standards to ensure an high level of security and privacy. Data can be centralized in a Knowledge Graph or distributed as Linked Data. LODMAP2D can be easily customized to match a specific data domain. See for example the [Italian Budget](https://budget.g0v.it) produced by the [g0v.it team](https://github.com/gov-it/) and published by the [Copernicani Association](http://copernicani.it)


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
| /{?s} | renderizza un soggetto di tipo bgo:Overview come un insieme di bolle |
| /table{?s} | renderizza un soggetto di tipo bgo:TableView  |
| /credits | renderizza un soggetto di tipo bgo:CreditsView |
| /terms | renderizza un soggetto di tipo bgo:TermsView |
| /account/{account_id} | renderizza un soggetto di tipo bgo:Account |
| /partition/{partition_id}{?s} | renderizza un soggetto di tipo bgo:Partition |


Il parametro opzionale  *s* permette di filtrare nella visualizzazione gli account il cui titolo, la cui descrizione o la cui id contiene, anche parzialmente, la stringa passata come valore al parametro.


## Development

LODMAP2D è una single page application sviluppata nel framework [Vue](https://vuejs.org/) in accordo alle specifiche [SOLID](https://github.com/solid/solid-spec) basata sulla la libreria [Data Driven Document (d3)](https://d3js.org/)

Il modello dei dati adotta il [Resource Description Framework (RDF)](https://www.w3.org/RDF/) e gli standard del [Semanitic Web](https://www.w3.org/standards/semanticweb/data). 
In particolare LODMAP2D in grado di riconoscere dati espressi con la [Bubble Graph Ontology](http://linkeddata.center/lodmap-bgo/v1).:

I dati sono ottenuti attraverso una pseudo-dereferenziazione delle rotte gestite internamente dalla applicazione attraverso la libreria bgolib, che a sua volta estende la libreria [rdflib](https://github.com/linkeddata/rdflib.js/)

Nella configurazione di default alcuni dati di esempio sono contenuti nel file 
[sample.ttl](public/sample.ttl)

## Security

LODMAP2D è molto rispettosa della privacy degli utenti, non utilizza nessun codice di tracciamento e non usa alcun cookie.

Se le risorse dereferenziate lo richiedono, LODMAP2D si autentica utizzando il [WebID](https://www.w3.org/wiki/WebID) che l'utente specifica in fase di login. La login è necessaria solo
per accedere a dati riservati e per funzioni future, non è necessaria per accedere a dati pubblici.

Se l'utente non è autenticato, i dati non accessibili sono ignorati.

## Personalizzazioni

### Personalizzazione della applicazione

E' possibile personalizzare l'applicazione sovrascrivendo i file contenuti nella directory public:

- il file index.html può essere personalizzato per inserire snippet di tracciamento (es. google analytics) o css privati, per modificare il titolo della applicazione e altri parametri per il SEO.
- i file favicon* possono essere modificati a piacere così come i loghi
- il file preview.png è usato come immagine di riferimento nei social
- il file IE_alert gestisce l'alert visualizzato a fronte di un browser non compatibile
   
Per non perdersi la possibilità di aggiornamento del LODMAP2D si consiglia fortemente di non sovrascrivere altri file oltre quelli indicati. L'utilizzo di docker semplifica enormemente le attività di personalizzazione. Vedi un esempio nel progetto https://github.com/g0v-it/web-budget.


### Personalizzazione dei dati

LODMAP2D è predisposto per deferenziare le rotte (e quindi caricare i dati) in due modalità differenti, pilotabile dalla variabile di ambiente LODMAP2D_DATA: se la variabile non esiste o è vuota, sono caricati dei dati di test, altrimenti si assume che la variabile LODMAP2D_DATA contenga un endAnche il point che fornisca le seguenti risorse serializzato in turtle:

risorsa | contenuto ritornato
------- | -------------------
LODMAP2D_DATA/app.ttl | contiene dati relativi ai menu utilizzati da tutte le rotte.
LODMAP2D_DATA/account/*account_id*  | contiene i dati relativi all'account *account_id*
LODMAP2D_DATA/partition/*partition_id*  | contiene i dati specifici relativi alla partizione *partition_id*
LODMAP2D_DATA/credits.ttl | contiene i dati specifici alla rotta /credits
LODMAP2D_DATA/terms.ttl | contiene i dati  specifici alla rotta /terms 
LODMAP2D_DATA/accounts.ttl | contiene un indice di tutte gli account, includendo solo
le un subset delle informazioni presenti in dettaglio anche nei file della directory account 
LODMAP2D_DATA/overview.ttl | contiene  dati  specifici alla rotta principale (/)

Sono possibili altre configurazioni per l'endpoint, ottenibili modificando il file [config.js](config.js)

Il file [config.js](config.js) contiene le regole che sovraintendono alla dereferenziazione delle rotte; in particolare la proprietà *dereferencingRules* permette di specificare una serie di regole con cui riscrivere gli URI al fine della loro dereferenziazione.


Una regola di riscrittura è composta da tre attributi:

- una espressione regolare (*regexp*) che viene applicata all'uri
- un array di template (*targets*) che può riferire gruppi presenti nella regexp. I target sono le risorse che contengono i dati in una delle serializazioni di RDF riconosciute dalla libreria rdflib (e.g. turtle, xml, ntriple, html, etc).
- un valore booleano (*isLast*) che dice se le regole successive devono essere ignorate.

Le regole sono valutate in sequenza. Se nessuna regola è applicabile viene usato il metodo standard di dereferenziazione degli uri.

Nella directory *doc/config* è possibile trovare alcuni esempi di di configurazione più articolati che consentono all'applicazione di usare remoti.

# Thanks

- [Enrico Fagnoni](https://github.com/ecow),[Miah Mohd Ehtesham](https://github.com/miahmohd), [Leonardo Longhi](https://github.com/LeonardoLonghi) and [Yassine Ouahidi](https://github.com/YassineOuahidi) the webapp code design.
- The [D3.js library](https://d3js.org/)
- [Evan You](http://evanyou.me/) and the [Vue community](https://vuejs.org) for the great framework
- TimBL & LinkedData team for SOLID and [rdflib project](https://github.com/linkeddata/rdflib.js)

## License

Please see [License File](LICENSE) for more information.
