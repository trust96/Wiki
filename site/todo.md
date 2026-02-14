# Site Todo

## Todo

- [ ] Avoid calc for spacing and use css variables instead
  - Message: "[website] [feature] Avoid calc for spacing and use css variables instead"

- [ ] Add the minimally needed css variables for the website
  - Message: "[website] [feature] Add css variables"

- [ ] Use the --color-border variable for all the borders in the website
  - Message: "[website] [feature] Use --border-color variable for borders"
  - Steps:
    - [ ] Add the --color-border variable to the css variables
    - [ ] Replace all the border colors with the --color-border variable (--border-color and --neutral-color-300)

- [ ] Refactor buttons to match the style in the website
  - Message: "[website] [feature] Refactor buttons to match the style in the website"

### Mobile

#### Navigation bar

#### Footer

#### Pages

##### Home page

- [ ] refactor the blog section, ui wise
  - Steps:
    - [x] Create a badge component
      - Branch: "feature/badge"
      - Message: "[general] [feature] Create badge component"
    - [x] Create typography component
      - Branch: "feature/typography"
      - Message: "[general] [feature] Create typography component"
    - [x] align the ui with the characteristics of the website (colors, spacing, etc)
      - Branch: "chores/homepage_blog_section"
      - Message: "[website] [chores] Uniform the blog section with the rest of the ui"

- [x] Recreate the search input
  - Steps:
    - [x] Create the input component
      - Branch: "feature/input"
      - Message: "[general] [feature] Create input component"
      - Details:
        - The input component should be a simple input with a label and an icon (optional)
        - Variants: number, text, search, email
    - [x] Add the search button (in small screens it shall be wide as the input)
      - Branch: "chores/homepage_search_input"
      - Message: "[website] [feature] Add search input to the homepage"

- [ ] Add dropdown for the language selection
  - Steps:
    - Create the dropdown component
      - Branch: "feature/dropdown"
      - Message: "[general] [feature] Create dropdown component"
    - Add dropdown for language selection in the Navigation bar
      - Branch: "chores/homepage_language_dropdown"
      - Message: "[website] [feature] Add dropdown for language selection"

##### Entity page

- [ ] Finish the table of contents for the entity page
  - Message: "[website] [entity page] Add table of contents"

##### Blog page

##### Our mission page

##### Why to contribute page

### Tablet

### Desktop
