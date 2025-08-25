# 🍿 MoodBites - E-commerce Website

> **Il tuo snack perfetto per ogni momento della giornata**

MoodBites è un sito web e-commerce moderno e responsivo dedicato alla vendita di snack premium per studenti e giovani professionisti. Con un design pulito e un'esperienza utente ottimizzata, offre una vasta gamma di prodotti per ogni momento della giornata.

![Website Preview](https://img.shields.io/badge/Website-Live-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Caratteristiche Principali

### 🛍️ **E-commerce Completo**
- **Catalogo Prodotti**: Visualizzazione elegante con filtri per categoria
- **Carrello Avanzato**: Gestione quantità, rimozione prodotti, calcolo totale
- **Interfaccia Intuitiva**: Design pulito e navigazione semplificata

### 🎨 **Design Moderno**
- **Clean UI**: Estetica minimalista e professionale
- **Responsive Design**: Perfettamente adattabile a desktop, tablet e mobile
- **Animazioni Fluide**: Transizioni CSS eleganti e performanti

### 📱 **Mobile-First**
- **Menu Mobile**: Navigazione ottimizzata per dispositivi touch
- **Layout Responsivo**: Grid CSS moderne per ogni risoluzione
- **Performance**: Caricamento veloce e UX ottimizzata

### 🔍 **Funzionalità Avanzate**
- **Informazioni Allergeni**: Sezione dedicata con design card-based
- **Sistema di Filtri**: Ricerca per categoria prodotto
- **Form di Contatto**: Integrazione con validazione JavaScript

## 🗂️ Struttura del Progetto

```
website/
├── 📄 index.html          # Homepage principale
├── 📄 prodotti.html       # Catalogo prodotti
├── 📄 carrello.html       # Carrello acquisti
├── 📄 chisiamo.html       # Pagina chi siamo
├── 📄 contatti.html       # Form contatti
├── 📄 allergeni.html      # Informazioni allergeni
├── 🎨 style.css           # Stili CSS principali
├── ⚡ script.js           # Logica JavaScript
├── 📊 data.json           # Database prodotti
└── 🖼️ img/               # Assets immagini
```

## 🚀 Come Iniziare

### Installazione Locale

```bash
# Clona il repository
git clone https://github.com/alessiaramello-sudo/website.git

# Entra nella directory
cd website

# Apri con un server locale (es. Live Server in VS Code)
# oppure semplicemente apri index.html nel browser
```

### Requisiti

- **Browser moderno** (Chrome, Firefox, Safari, Edge)
- **Server HTTP locale** (opzionale, per development)
- Nessuna dipendenza esterna richiesta

## 🛠️ Tecnologie Utilizzate

### Frontend
- **HTML5**: Struttura semantica e accessibile
- **CSS3**: 
  - Custom Properties (CSS Variables)
  - Flexbox & CSS Grid
  - Animazioni e transizioni
  - Design responsivo
- **JavaScript ES6+**:
  - Gestione carrello
  - Filtri prodotti
  - Validazione form
  - Local Storage

### Design System
- **Font**: Inter (Google Fonts)
- **Icone**: Font Awesome 6
- **Palette Colori**: 
  - Primary: `#ff6b6b` (Coral)
  - Secondary: `#4ecdc4` (Teal)
  - Accent: `#ffe66d` (Yellow)

## 📱 Pagine Principali

### 🏠 **Homepage** (`index.html`)
- Hero section accattivante
- Showcase prodotti in evidenza
- Sezioni informative
- CTA per azioni principali

### 🛍️ **Prodotti** (`prodotti.html`)
- Grid responsiva prodotti
- Sistema di filtri per categoria
- Animazioni hover
- Bottoni "Aggiungi al carrello"

### 🛒 **Carrello** (`carrello.html`)
- Gestione completa prodotti
- Calcolo automatico totali
- Interfaccia di checkout
- Persistenza dati (Local Storage)

### ℹ️ **Chi Siamo** (`chisiamo.html`)
- Storia dell'azienda
- Valori e missione
- Team presentation
- Call-to-action

### 📞 **Contatti** (`contatti.html`)
- Form di contatto validato
- Mappa integrata
- Informazioni di contatto
- Newsletter signup

### 🛡️ **Allergeni** (`allergeni.html`)
- Design card-based pulito
- Informazioni per categoria
- Tag colorati per allergeni
- Sezione informativa essenziale

## 🎨 Caratteristiche Design

### Clean Modern Aesthetic
- **Minimalismo**: Design pulito senza elementi superflui
- **Tipografia**: Hierarchy chiara con font Inter
- **Spacing**: Sistema di spaziature consistente
- **Colori**: Palette armoniosa e accessibile

### Responsive Design
```css
/* Mobile First Approach */
@media (max-width: 768px) {
    /* Stili mobile */
}

@media (min-width: 1024px) {
    /* Stili desktop */
}
```

### CSS Architecture
- **CSS Custom Properties**: Variabili per consistenza
- **BEM Methodology**: Nomenclatura CSS organizzata
- **Component-Based**: Stili modulari e riutilizzabili

## ⚡ Performance & Ottimizzazioni

- **CSS Ottimizzato**: Minimo overhead, massima performance
- **Immagini Responsive**: Caricamento adattivo
- **JavaScript Modulare**: Codice organizzato e performante
- **Local Storage**: Persistenza dati lato client

## 🔧 Personalizzazione

### Modifica Colori
```css
:root {
    --primary-color: #ff6b6b;      /* Colore principale */
    --secondary-color: #4ecdc4;    /* Colore secondario */
    --accent-color: #ffe66d;       /* Colore accent */
}
```

### Aggiungere Prodotti
Modifica il file `data.json`:
```json
{
    "id": "nuovo-prodotto",
    "name": "Nome Prodotto",
    "price": 4.99,
    "category": "categoria",
    "image": "img/prodotto.jpg"
}
```

## 📈 Roadmap Future

- [ ] **Backend Integration**: API per gestione prodotti
- [ ] **Sistema Pagamenti**: Integrazione payment gateway
- [ ] **User Authentication**: Login e registrazione utenti
- [ ] **Dashboard Admin**: Pannello gestione prodotti
- [ ] **Analytics**: Tracking comportamento utenti
- [ ] **PWA Features**: Service Worker e offline support

## 👥 Contribuire

1. **Fork** il repository
2. **Crea** un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. **Push** al branch (`git push origin feature/AmazingFeature`)
5. **Apri** una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT - vedi il file [LICENSE](LICENSE) per dettagli.

## 📞 Contatti

- **Sviluppatore**: Alessia Ramello
- **GitHub**: [@alessiaramello-sudo](https://github.com/alessiaramello-sudo)
- **Email**: [info@moodbites.it](mailto:info@moodbites.it)

---

<div align="center">

**⭐ Se ti piace questo progetto, lascia una stella! ⭐**

Made with ❤️ for students everywhere

</div>
