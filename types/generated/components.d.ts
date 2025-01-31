import type { Schema, Struct } from '@strapi/strapi';

export interface AtributosEcommerceAtributo extends Struct.ComponentSchema {
  collectionName: 'components_atributos_ecommerce_atributos';
  info: {
    displayName: 'Atributo';
  };
  attributes: {
    type: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface FilantropiaFilantropiaElement extends Struct.ComponentSchema {
  collectionName: 'components_filantropia_filantropia_elements';
  info: {
    displayName: 'Filantropia Element';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SliderSliderElement extends Struct.ComponentSchema {
  collectionName: 'components_slider_slider_elements';
  info: {
    displayName: 'Slider element';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface TimelineTimelineElement extends Struct.ComponentSchema {
  collectionName: 'components_timeline_timeline_elements';
  info: {
    displayName: 'Timeline Element';
  };
  attributes: {
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    year: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface ViticulturaViticulturaElement extends Struct.ComponentSchema {
  collectionName: 'components_viticultura_viticultura_elements';
  info: {
    displayName: 'Viticultura Element';
  };
  attributes: {
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'atributos-ecommerce.atributo': AtributosEcommerceAtributo;
      'filantropia.filantropia-element': FilantropiaFilantropiaElement;
      'slider.slider-element': SliderSliderElement;
      'timeline.timeline-element': TimelineTimelineElement;
      'viticultura.viticultura-element': ViticulturaViticulturaElement;
    }
  }
}
