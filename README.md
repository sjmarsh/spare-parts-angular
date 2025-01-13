# SparePartsAngular
This is an Angular based client for the Spare Parts .Net API [https://github.com/sjmarsh/SpareParts](https://github.com/sjmarsh/SpareParts).  Similarly to that repo, this is a Spike/Playground project to test out different Angular technologies and patterns.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.3.

## Technologies:
- Angular
- Angular Material
- NgRx

** If starting in a new dev environment remeber to setup local dev certificates in a \certs folder using "mkcert localhost" command.

## Outstanding Tasks (TODO):
###  - Nav Menu 
 - Nav Menu should expand on large screen by default.  
 - Nav Menu sizing needs fixing on large screen (seems OK for Mobile).
###  - Part Search
 - Fields Chips not disabled for fields that have been used in the filters.  
 - Fields Chips check marks are not working as expected.  Need to override out-of-the-box behaviour.
 - Search Results Grid should have expanders to reveal Part Attributes (if they exist for the part).
 - Improve Test Coverage.


## Development server

Run `ng serve --ssl --open` for a dev server.  This should automatically launch the app in the default browser (with `https://localhost:4200/`). The application will automatically reload if you change any of the source files.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
