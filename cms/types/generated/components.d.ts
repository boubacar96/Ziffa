import type { Schema, Struct } from '@strapi/strapi';

export interface ProgrammeFilmLine extends Struct.ComponentSchema {
  collectionName: 'components_programme_film_lines';
  info: {
    description: 'Un film projet\u00E9 dans une activit\u00E9 du programme';
    displayName: 'Film (ligne)';
    icon: 'film';
  };
  attributes: {
    country: Schema.Attribute.String;
    director: Schema.Attribute.String;
    duration: Schema.Attribute.String;
    language: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    year: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'programme.film-line': ProgrammeFilmLine;
    }
  }
}
