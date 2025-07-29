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

export interface CouponCoupon extends Struct.ComponentSchema {
  collectionName: 'components_coupon_coupons';
  info: {
    description: '';
    displayName: 'coupon';
    icon: 'priceTag';
  };
  attributes: {
    appliesTo: Schema.Attribute.Enumeration<
      ['Valor total del carrito', 'Reservas', 'Productos']
    > &
      Schema.Attribute.Required;
    code: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    endDate: Schema.Attribute.DateTime & Schema.Attribute.Required;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    percent: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    products: Schema.Attribute.Relation<'oneToMany', 'api::producto.producto'>;
    startDate: Schema.Attribute.DateTime & Schema.Attribute.Required;
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

export interface PoliticaPolitica extends Struct.ComponentSchema {
  collectionName: 'components_politica_politicas';
  info: {
    displayName: 'Politica';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PromocionPromocion extends Struct.ComponentSchema {
  collectionName: 'components_promocion_promocions';
  info: {
    displayName: 'Promoci\u00F3n';
  };
  attributes: {
    description: Schema.Attribute.Text;
    endDate: Schema.Attribute.DateTime;
    isActive: Schema.Attribute.Boolean;
    minQuantity: Schema.Attribute.Integer;
    name: Schema.Attribute.String;
    productos: Schema.Attribute.Relation<'oneToMany', 'api::producto.producto'>;
    quantityToPay: Schema.Attribute.Integer;
    startDate: Schema.Attribute.DateTime;
  };
}

export interface PuntoDeVentaPuntoDeVenta extends Struct.ComponentSchema {
  collectionName: 'components_punto_de_venta_punto_de_ventas';
  info: {
    description: '';
    displayName: 'Punto de venta';
    icon: 'layout';
  };
  attributes: {
    address: Schema.Attribute.Text & Schema.Attribute.Required;
    city: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ReglasDiaRestringido extends Struct.ComponentSchema {
  collectionName: 'components_reglas_dia_restringidos';
  info: {
    description: '';
    displayName: 'Dia Restringido';
    icon: 'calendar';
  };
  attributes: {
    restrictedDay: Schema.Attribute.Enumeration<
      ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
    > &
      Schema.Attribute.Required;
  };
}

export interface ReglasRangoDeHora extends Struct.ComponentSchema {
  collectionName: 'components_reglas_rango_de_horas';
  info: {
    description: '';
    displayName: 'Rango de hora';
    icon: 'calendar';
  };
  attributes: {
    endDate: Schema.Attribute.Date & Schema.Attribute.Required;
    endTime: Schema.Attribute.Time & Schema.Attribute.Required;
    startDate: Schema.Attribute.Date & Schema.Attribute.Required;
    startTime: Schema.Attribute.Time & Schema.Attribute.Required;
  };
}

export interface ReglasReglaRangoDeFecha extends Struct.ComponentSchema {
  collectionName: 'components_reglas_regla_rango_de_fechas';
  info: {
    description: '';
    displayName: 'Rango de Fecha';
    icon: 'calendar';
  };
  attributes: {
    endDate: Schema.Attribute.Date & Schema.Attribute.Required;
    startDate: Schema.Attribute.Date & Schema.Attribute.Required;
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
      'coupon.coupon': CouponCoupon;
      'filantropia.filantropia-element': FilantropiaFilantropiaElement;
      'politica.politica': PoliticaPolitica;
      'promocion.promocion': PromocionPromocion;
      'punto-de-venta.punto-de-venta': PuntoDeVentaPuntoDeVenta;
      'reglas.dia-restringido': ReglasDiaRestringido;
      'reglas.rango-de-hora': ReglasRangoDeHora;
      'reglas.regla-rango-de-fecha': ReglasReglaRangoDeFecha;
      'slider.slider-element': SliderSliderElement;
      'timeline.timeline-element': TimelineTimelineElement;
      'viticultura.viticultura-element': ViticulturaViticulturaElement;
    }
  }
}
