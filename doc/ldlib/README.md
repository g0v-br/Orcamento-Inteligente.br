Libreria bgo
=====================

La libreria bgo estende la libreria rdflib aggiungendo alcune features:

- dereferenziazione e  ingestion dei dataset 
- gestione automatica della autenticazione tramite webid o basic http auth

bgo aggiunge la funzione *dref* che è in grado di forzare alcune regole di riscrittura degli uri prima di passare alla dereferenziazione standard. Di fatto una implementazione molto semplificata di quanto fa il module "mod_rewrite" di apache.

Una regola di riscrittura è composta da due proprietà:

- una espressione regolare (*regexp*) che viene applicata all'uri
- un array di template (*targets*) che può riferire gruppi presenti nella regexp. I target sono risorse
da caricare nello store attraverso il fetcher.

Le regole sono valutate in sequenza e solo la prima regola la cui espressione regolare matcha l'uri è applicata. Se nessuna regola è applicabile viene usato direttamente fetcher

## gestione autenticazione


Da discutere:


Se l'accesso ad una delle risorse da caricare produce un error 401, il sistema deve 
chiedere all'utente di loggarsi e poi riprova. Sarebbe ottimo se si capisse se è richiesta
una