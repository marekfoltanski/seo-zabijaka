# SEO ZABIJAKA
**Cieszę się, że trafiłeś na to repozytorium. Jeżeli uważasz, że narzędzie jest przydatne to możesz postawić mi kawę na Buy Me A Coffe :)**

<a href="https://www.buymeacoffee.com/marekfoltas" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

**Spis treści**

- [SEO ZABIJAKA](#seo-zabijaka)
  * [Czym jest SEO ZABIJAKA?](#czym-jest-seo-zabijaka)
  * [Jak to działa?](#jak-to-działa)
  * [Jak odpalić SEO ZABIJAKĘ?](#jak-odpalić-seo-zabijakę)
    + [Przygotowanie środowiska](#przygotowanie-środowiska)
    + [Klucze API](#klucze-api)
      - [OpenAI API](#openai-api)
      - [Pixabay API](#pixabay-api)
      - [Wordpress API](#wordpress-api)
    + [Plik CSV](#plik-csv)
    + [Uruchom narzędzie](#uruchom-narzędzie)

## Czym jest SEO ZABIJAKA?

**SEO ZABIJAKA** to narzędzie, które samodzielnie napisze i opublikuje na Wordpress dowolną liczbę tekstów. Po Twojej stronie jest jedynie podanie listy tematów, dla których treści mają zostać stworzone. 

Średni czas stworzenia i opublikowania jednego tekstu to około **30 sekund**, taka wydajność pozwala między innymi na błyskawiczne tworzenie zaplecz SEO. Wydajność może być różna w zależności od obłożenia API OpenAI.

Narzędzie łączy w sobie 3 różne API:

* OpenAI API - pay-as-you-go, służy do tworzenia treści (gpt-3, davinci-3)
* Pixabay API - free, służy do pobrania zdjęcia
* Wordpess API - free, służy do opublikowania treści i zdjęcia na Wordpressie

## Jak to działa?
1. Narzędzie najpierw pobiera listę tematów z pliku CSV, następnie dla każdego tematu pisana jest treść. Jest ona tworzona na zasadzie polecenia:
“Napisz artykuł na temat {tytuł_artykułu}. Artykuł powinien zawierać 3 nagłówki, dla każdego nagłówka napisz dwa akapity.”. Jeżeli w pliku CSV podasz nagłówki przypisane do danego tematu to polecenie wygląda w sposób następujący: “Napisz dwa akapity na temat {tytuł_artykułu}”. Wtedy treść jest tworzona osobno dla każdego nagłówka. Prompt możesz edytować w pliku openai.js, jeżeli chcesz go dostosować do swoich potrzeb to zachęcam do pobawienia się w OpenAI [Playground](https://platform.openai.com/playground).

2. Jeżeli w pliku CSV dodałeś “Image search query” dla zdjęcia to dla danego tematu zostanie pobrane zdjęcie z Pixabay.

3. Stworzona treść i zdjęcie zostają zapisane na dysku w folderze “posts”. Tekst jest sformatowany do HTML.

4. Stworzona treść jest dodawana do Wordpressa. Pobrane zdjęcie jest uploadowane do biblioteki multimediów i przypisywane do danego wpisu. Każdy wpis możesz dodatkowo przydzielić do kategorii i tagów. Żeby to zrobić musisz utworzyć kategorię lub tag w wordpressie, następnie podać ich ID w pliku CSV. Wtedy wpis zostanie przypisany do danej taksonomii.

5. Po dodaniu wszystkich wpisów stworzony zostaje plik summary.csv, który zawiera wszystkie stworzone teksty sformatowane do HTML oraz link do opublikowanego wpisu na Wordpress.

## Jak odpalić SEO ZABIJAKĘ?

Żeby odpalić narzędzie musisz przygotować sobie środowisko, przygotować plik CSV z tematami i podać klucze API.

### Przygotowanie środowiska

Narzędzie jest napisane w Node.js, dlatego najpierw musisz się upewnić, że masz zainstalowane Node.js oraz npm. Do pobrania [tutaj](https://nodejs.org/en/). Dodatkowo możesz zainstalować np. Visual Studio Code ([link](https://code.visualstudio.com/)), w którym będziesz edytował prompt i odpalał narzędzie.

Jeżeli masz już to ogarnięte to pobierz repozytorium, otwórz folder projektu w VSC i wpisz w terminalu:
```
npm install
```
Po zainstalowaniu wszystkich dependencji przystąp do konfiguracji narzędzia.

### Klucze API

Niezbędnym do poprawnego działania **SEO ZABIJAKI** jest podanie wszystkich kluczy API. Klucze dodaj w pliku **keys.js**.

#### OpenAI API

Najpierw musisz założyć konto tutaj:

[https://openai.com/api/](https://openai.com/api/)

Jeżeli nie zakładałeś wcześniej konta na OpenAI to dostaniesz **18$** na przetestowanie. W innym wypadku musisz dodać formę płatności i ustawić limity $, których nie chcesz przekroczyć. Koszt tworzenia treści jest śmiesznie niski, więc nie musisz się martwić wysokimi kosztami.

Klucz API podaj w pliku keys.js jako **AI_KEY**.

#### Pixabay API

Załóż konto tutaj: \
[https://pixabay.com/api/docs/](https://pixabay.com/api/docs/)

API jest darmowe, jeżeli jesteś zalogowany to klucz znajdziesz pod powyższym linkiem pod nagłówkiem Parameters.

Klucz API podaj w pliku keys.js jako **PB_KEY**.


#### Wordpress API

**Uwaga: Żeby SEO ZABIJAKA dodawał wpisy na wordpressa, Twoja strona musi mieć aktywny certyfikat SSL.**

Każda strona oparta o Wordpress ma domyślnie swoje REST API. Najpierw sprawdź swój endpoint, powinien być dostępny pod adresem: \
[https://twoja-domena.pl/wp-json/wp/v2/](https://twoja-domena.pl/wp-json/wp/v2/)

Podaj endpoint w pliku keys.js jako **WP_ENDPOINT**

Następnie stwórz Hasło aplikacji. Żeby to zrobić przejdź w dashboardzie wordpressa do zakładki **Użytkownicy > Profil**. Na samym dole jest sekcja “Hasła aplikacji”. Podaj nazwę hasła i kliknij “Dodaj nowe hasło aplikacji”. Wygenerowane hasło wklej w pliku keys.js jako **WP_PASS**.

Jeżeli masz problem z wygenerowaniem hasła to [tutaj](https://www.paidmembershipspro.com/create-application-password-wordpress/) instrukcja.

Na końcu dodaj nazwę użytkownika (nie nazwę hasła, które dodałeś wcześniej tylko nazwę użytkownika, za pomocą której logujesz się do wordpressa) jako **WP_USER**.

### Plik CSV

W następnej kolejności przygotuj plik CSV według tego szablonu:

[https://docs.google.com/spreadsheets/d/1obQKgSCfOBQ_GUkkpavzk9vudJ6zynINzf3mB3hGH-w/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1obQKgSCfOBQ_GUkkpavzk9vudJ6zynINzf3mB3hGH-w/edit?usp=sharing)

W pliku CSV możesz uzupełnić:

* Title - lista tytułów, dla których teksty mają być napisane, każdy tytuł podaj w osobnym wierszu. Lista tytułów wystarczy żeby narzędzie działało poprawnie, pozostałe kolumny są opcjonalne. Nie ma limitu jeżeli chodzi o liczbę tekstów, ogranicza Cię jedynie $ w OpenAI.

* Headings - jeżeli chcesz żeby tekst był napisany według konkretnych nagłówków to możesz podać je w tej kolumnie. Każdy nagłówek powinien być podany w nowej linii. Musisz pamiętać o tym, że jeżeli tekst jest pisany według nagłówków to każdy nagłówek jest osobnym tekstem, a nie kontynuacją poprzednich akapitów.

* Image search query - jeżeli chcesz żebyss do wpisu zostało dodane zdjęcie to możesz podać frazę, która posłuży do znalezienia zdjęcia na pixabay. Czyli jeżeli wpiszesz tam “office” to jako zdjęcie zostanie wybrany losowy obraz z [https://pixabay.com/images/search/office/](https://pixabay.com/images/search/office/)

* Categories, Tags - tutaj możesz podać ID taksonomii, do których chcesz przypisać wpis na wordpressie. Taksonomie muszą zostać utworzone wcześniej - narzędzie nie tworzy nowych kategorii / tagów, tylko przypisuje do już istniejących.

Plik CSV zapisz w folderze projektu jako **data.csv**.

### Uruchom narzędzie

Jeżeli wszystko masz poprawnie skonfigurowane to możesz uruchomić narzędzie wpisując w terminalu:
```
node index.js
```
W konsoli będziesz widział postęp tworzonych treści. Wszystkie teksty są na bieżąco zapisywane na dysku oraz publikowane na Wordpressie. Po dodaniu wszystkich treści w folderze projektu powstanie plik **summary.csv**, który zawiera wszystkie stworzone teksty sformatowane do HTML oraz linki do wpisów.

**Uwaga: Może się zdarzyć, że ze względu na duże obciążenie API OpenAI część tekstów się nie wygeneruje. Możesz to później sprawdzić w pliku summary.csv i przygotować nowy plik data.csv dla tych tekstów, które nie zostały napisane i odpalić narzędzie jeszcze raz.**

Jeżeli chcesz stworzyć teksty, ale nie chcesz ich publikować na wordpressie to w pliku index.js zmień na samym dole:
```
app({
  wordpress: true,
});
```

na:
```
app({
  wordpress: false,
});
```

Wtedy teksty razem ze zdjęciami zostaną zapisane na dysku w folderze **posts**, ale nie zostaną dodane do wordpressa.
