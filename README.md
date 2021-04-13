# AngularBeadando

A projektet Angular CLI (11.2.4) használatával hoztam létre. https://github.com/angular/angular-cli

## Development server

A development server-t `ng serve` paranccsal lehet indítani, ami aztán a `http://localhost:4200/` címen érhető el.

## Feladat leírása

A feladat az volt, hogy egy pizzáriához készítsek a diszpécserek számára egy webes alkalmazást, amiben be lehet állítani, hogy a pizzériának hány sütője van és hogy egy pizzát mennyi ideig sütnek. Pizzát csak az rendelhet aki már vevőként benne van a rendszerben. A diszpécsereket nem adminisztráljuk. Ha valaki pizzát rendel, a diszpécser felviszi az alkalmazásba, aminek segítségével nyomon lehet követni, hogy mikor készül el a rendelés, illetve a sütők állapotát nyomon tudják követni. A diszpécser megmondja a vevőnek, hogy a rendelésére mennyit kell várni, ha a vevő nem akarja kivárni ezt az időt lemondhatja a rendelését, de csak akkor, ha még nem kezdték el sütni a rendelésének az első pizzáját.

## Alkalmazás működése

Az indítás után meg kell adni, hogy hány sütőnk van és hogy mennyi ideig sül egy pizza.
Ez inicializálja a sütőket és beállítja a pizzák sütési idejét.
A teszteléshez néhány vevőt és pizzát json file-ból beolvas a program.
Lehetőség van új vevő illetve pizza felvitelére, módosítására, törlésre.
Ki kell választani a vevőt aki rendel a kiválaszt gomb segítségével, és a pizzát vagy pizzákat amit rendel a pizzáknál a + és - gombok segítségével.
Ha minden pizza kiválasztásra került a vevőhöz a Rendelés leadása gombbal véglegesíthetjük.
Ekkor látható ahogy a sütők állapota megváltozik, láthatóak a sütők órái és hogy hol tart a sütési folyamatban.
Alatta pedig a felvett rendelések láthatóak kibontható formában.
Ha kibontjuk látjuk a rendelés adatait, hogy mennyi a fizetendő és hogy mikor készül el a rendelés.
Amíg a rendelés sorban állási fázisban van (fekete színnel jelölt hátralévő idő) a rendelés lemondható a Rendelés lemondása gombbal.
Ha lemondanak egy rendelést és "mögötte" van másik rendelés a sorban, akkor annak a hátralévő ideje újra számítódik.
Ha elkezdődött egy rendelés első pizzájának sütése (sárga színnel jelölt hátralévő idő) akkor már nem mondható le!
