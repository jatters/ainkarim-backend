import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminSession extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_sessions';
  info: {
    description: 'Session Manager storage';
    displayName: 'Session';
    name: 'Session';
    pluralName: 'sessions';
    singularName: 'session';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    absoluteExpiresAt: Schema.Attribute.DateTime & Schema.Attribute.Private;
    childId: Schema.Attribute.String & Schema.Attribute.Private;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deviceId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    expiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::session'> &
      Schema.Attribute.Private;
    origin: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sessionId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique;
    status: Schema.Attribute.String & Schema.Attribute.Private;
    type: Schema.Attribute.String & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    userId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAdditionalServiceAdditionalService
  extends Struct.CollectionTypeSchema {
  collectionName: 'additional_services';
  info: {
    description: '';
    displayName: 'Servicios Adicionales';
    pluralName: 'additional-services';
    singularName: 'additional-service';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    icon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::additional-service.additional-service'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    planes: Schema.Attribute.Relation<'manyToMany', 'api::plan.plan'>;
    price: Schema.Attribute.Integer & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    reservas: Schema.Attribute.Relation<'oneToMany', 'api::reserva.reserva'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAdvertenciaYRecomendacionAdvertenciaYRecomendacion
  extends Struct.SingleTypeSchema {
  collectionName: 'advertencias_y_recomendaciones';
  info: {
    displayName: 'Advertencias y recomendaciones';
    pluralName: 'advertencias-y-recomendaciones';
    singularName: 'advertencia-y-recomendacion';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    image: Schema.Attribute.Media<'images'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::advertencia-y-recomendacion.advertencia-y-recomendacion'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAvisoDePrivacidadAvisoDePrivacidad
  extends Struct.SingleTypeSchema {
  collectionName: 'avisos_de_privacidad';
  info: {
    description: '';
    displayName: 'Aviso de privacidad';
    pluralName: 'avisos-de-privacidad';
    singularName: 'aviso-de-privacidad';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    image: Schema.Attribute.Media<'images'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::aviso-de-privacidad.aviso-de-privacidad'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCepaDeVinoCepaDeVino extends Struct.CollectionTypeSchema {
  collectionName: 'cepas_de_vinos';
  info: {
    displayName: 'Cepas de Vino';
    pluralName: 'cepas-de-vinos';
    singularName: 'cepa-de-vino';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cepa-de-vino.cepa-de-vino'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    productos: Schema.Attribute.Relation<'oneToMany', 'api::producto.producto'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCorreoCorreo extends Struct.CollectionTypeSchema {
  collectionName: 'correos';
  info: {
    description: '';
    displayName: 'Correos';
    pluralName: 'correos';
    singularName: 'correo';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    allowMarketing: Schema.Attribute.Boolean;
    allowresponse: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.DateTime;
    formName: Schema.Attribute.String;
    fromMail: Schema.Attribute.Email;
    ipAddress: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::correo.correo'
    > &
      Schema.Attribute.Private;
    message: Schema.Attribute.Text;
    phone: Schema.Attribute.BigInteger;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user_agent: Schema.Attribute.Text;
    userName: Schema.Attribute.String;
    uuid: Schema.Attribute.UID;
  };
}

export interface ApiElVinedoElVinedo extends Struct.SingleTypeSchema {
  collectionName: 'el_vinedos';
  info: {
    description: '';
    displayName: 'El Vi\u00F1edo';
    pluralName: 'el-vinedos';
    singularName: 'el-vinedo';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    close: Schema.Attribute.String;
    contactEmail: Schema.Attribute.Email & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    facebook: Schema.Attribute.String;
    friday: Schema.Attribute.String;
    InfoEmail: Schema.Attribute.Email;
    instagram: Schema.Attribute.String;
    lastTour: Schema.Attribute.String;
    linkedin: Schema.Attribute.String;
    linkGoogleMaps: Schema.Attribute.String;
    linkWaze: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::el-vinedo.el-vinedo'
    > &
      Schema.Attribute.Private;
    monday: Schema.Attribute.String;
    officeAddress: Schema.Attribute.String;
    open: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    saturday: Schema.Attribute.String;
    sunday: Schema.Attribute.String;
    thursday: Schema.Attribute.String;
    tiktok: Schema.Attribute.String;
    tripAdvisor: Schema.Attribute.String;
    tuesday: Schema.Attribute.String;
    twitter: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ventasEmail: Schema.Attribute.Email & Schema.Attribute.Required;
    vinedoAddress: Schema.Attribute.String;
    vinedoPhone: Schema.Attribute.BigInteger;
    wednesday: Schema.Attribute.String;
    whatsapp: Schema.Attribute.BigInteger;
  };
}

export interface ApiExperienciaExperiencia extends Struct.CollectionTypeSchema {
  collectionName: 'experiencias';
  info: {
    description: '';
    displayName: 'Experiencias';
    pluralName: 'experiencias';
    singularName: 'experiencia';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::experiencia.experiencia'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    planes: Schema.Attribute.Relation<'manyToMany', 'api::plan.plan'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFaqFaq extends Struct.CollectionTypeSchema {
  collectionName: 'faqs';
  info: {
    description: '';
    displayName: 'FAQ';
    pluralName: 'faqs';
    singularName: 'faq';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    asnwer: Schema.Attribute.Blocks & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::faq.faq'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHorarioHorario extends Struct.CollectionTypeSchema {
  collectionName: 'horarios';
  info: {
    description: '';
    displayName: 'Horarios';
    pluralName: 'horarios';
    singularName: 'horario';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    capacity: Schema.Attribute.Integer & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    endTime: Schema.Attribute.Time & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::horario.horario'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    plane: Schema.Attribute.Relation<'manyToOne', 'api::plan.plan'>;
    publishedAt: Schema.Attribute.DateTime;
    startTime: Schema.Attribute.Time & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMenuMenu extends Struct.SingleTypeSchema {
  collectionName: 'menus';
  info: {
    description: '';
    displayName: 'Men\u00FA';
    pluralName: 'menus';
    singularName: 'menu';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    cover: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::menu.menu'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNosotroNosotro extends Struct.SingleTypeSchema {
  collectionName: 'nosotros';
  info: {
    description: '';
    displayName: 'Nosotros';
    pluralName: 'nosotros';
    singularName: 'nosotro';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    cover: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    filantropia: Schema.Attribute.Component<
      'filantropia.filantropia-element',
      true
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::nosotro.nosotro'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slider: Schema.Attribute.Component<'slider.slider-element', true>;
    slug: Schema.Attribute.UID<'title'>;
    timeline: Schema.Attribute.Component<'timeline.timeline-element', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    viticultura: Schema.Attribute.Component<
      'viticultura.viticultura-element',
      true
    >;
  };
}

export interface ApiPedidoPedido extends Struct.CollectionTypeSchema {
  collectionName: 'pedidos';
  info: {
    description: '';
    displayName: 'Pedidos';
    pluralName: 'pedidos';
    singularName: 'pedido';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    carrierName: Schema.Attribute.String;
    coupon: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    creationDate: Schema.Attribute.DateTime;
    customerAddress: Schema.Attribute.String;
    customerCity: Schema.Attribute.String;
    customerDeparment: Schema.Attribute.String;
    customerDocument: Schema.Attribute.String & Schema.Attribute.Required;
    customerDocumentType: Schema.Attribute.Enumeration<
      ['C\u00E9dula', 'C\u00E9dula de extranjer\u00EDa', 'NIT', 'Pasaporte']
    >;
    customerEmail: Schema.Attribute.Email & Schema.Attribute.Required;
    customerIpAddress: Schema.Attribute.String;
    customerLastname: Schema.Attribute.String & Schema.Attribute.Required;
    customerMiddleName: Schema.Attribute.String;
    customerName: Schema.Attribute.String & Schema.Attribute.Required;
    customerPhone: Schema.Attribute.String;
    customerSecondLastname: Schema.Attribute.String;
    discount: Schema.Attribute.Integer;
    items: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::pedido.pedido'
    > &
      Schema.Attribute.Private;
    numberOrder: Schema.Attribute.String & Schema.Attribute.Unique;
    payment_id: Schema.Attribute.String;
    payment_method: Schema.Attribute.String;
    payment_status: Schema.Attribute.Enumeration<
      ['Pendiente', 'Pago', 'Fallido', 'approved', 'in_process', 'rejected']
    >;
    productos: Schema.Attribute.Relation<
      'manyToMany',
      'api::producto.producto'
    >;
    publishedAt: Schema.Attribute.DateTime;
    reservas: Schema.Attribute.Relation<'manyToMany', 'api::reserva.reserva'>;
    sheetSyncedOrder: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    state: Schema.Attribute.Enumeration<
      [
        'Pendiente',
        'Procesando',
        'En espera',
        'Completado',
        'Cancelado',
        'Reembolsado',
        'Fallido',
        'Borrador',
        'Pago',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Borrador'>;
    totalPriceOrder: Schema.Attribute.Integer;
    trackingNumber: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user_agent: Schema.Attribute.String;
    users_permissions_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiPlanPlan extends Struct.CollectionTypeSchema {
  collectionName: 'planes';
  info: {
    description: '';
    displayName: 'Planes';
    pluralName: 'planes';
    singularName: 'plan';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    allowChilds: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    duration: Schema.Attribute.Integer;
    experiencias: Schema.Attribute.Relation<
      'manyToMany',
      'api::experiencia.experiencia'
    >;
    gallery: Schema.Attribute.Media<'images', true>;
    horarios: Schema.Attribute.Relation<'oneToMany', 'api::horario.horario'>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::plan.plan'> &
      Schema.Attribute.Private;
    max_reservations: Schema.Attribute.Integer & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    onlyAdults: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    order: Schema.Attribute.Integer;
    planDescription: Schema.Attribute.Blocks & Schema.Attribute.Required;
    price: Schema.Attribute.Integer & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    reglas_planes: Schema.Attribute.Relation<
      'manyToMany',
      'api::regla-plan.regla-plan'
    >;
    reservas: Schema.Attribute.Relation<'oneToMany', 'api::reserva.reserva'>;
    SEODescription: Schema.Attribute.Text;
    servicios_adicionales: Schema.Attribute.Relation<
      'manyToMany',
      'api::additional-service.additional-service'
    >;
    showInHome: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    unitPlan: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPoliticaDatoPersonalPoliticaDatoPersonal
  extends Struct.SingleTypeSchema {
  collectionName: 'politica_datos_personales';
  info: {
    description: '';
    displayName: 'Politica Datos Personales';
    pluralName: 'politica-datos-personales';
    singularName: 'politica-dato-personal';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    image: Schema.Attribute.Media<'images'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::politica-dato-personal.politica-dato-personal'
    > &
      Schema.Attribute.Private;
    politica: Schema.Attribute.Component<'politica.politica', true>;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPopupPopup extends Struct.SingleTypeSchema {
  collectionName: 'popups';
  info: {
    description: '';
    displayName: 'Popup';
    pluralName: 'popups';
    singularName: 'popup';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    endDate: Schema.Attribute.DateTime & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::popup.popup'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    startDate: Schema.Attribute.DateTime & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    visibleInHome: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    visibleInPlans: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    visibleInStore: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface ApiProductCategoryProductCategory
  extends Struct.CollectionTypeSchema {
  collectionName: 'productcategories';
  info: {
    description: '';
    displayName: 'Categorias de producto';
    pluralName: 'productcategories';
    singularName: 'product-category';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-category.product-category'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    productos: Schema.Attribute.Relation<'oneToMany', 'api::producto.producto'>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiProductoProducto extends Struct.CollectionTypeSchema {
  collectionName: 'productos';
  info: {
    description: '';
    displayName: 'Productos';
    pluralName: 'productos';
    singularName: 'producto';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    categorias_de_producto: Schema.Attribute.Relation<
      'manyToOne',
      'api::product-category.product-category'
    >;
    cepas_de_vino: Schema.Attribute.Relation<
      'manyToOne',
      'api::cepa-de-vino.cepa-de-vino'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    gallery: Schema.Attribute.Media<'images', true>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    isVariable: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::producto.producto'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer;
    outOfStock: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    pedidos: Schema.Attribute.Relation<'manyToMany', 'api::pedido.pedido'>;
    price: Schema.Attribute.Integer;
    productDescription: Schema.Attribute.Blocks & Schema.Attribute.Required;
    productInHome: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    publishedAt: Schema.Attribute.DateTime;
    regularPrice: Schema.Attribute.Integer & Schema.Attribute.Required;
    sku: Schema.Attribute.UID;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    variaciones: Schema.Attribute.Relation<
      'manyToMany',
      'api::variacion.variacion'
    >;
    wineColor: Schema.Attribute.Enumeration<
      ['No Aplica', 'Tinto', 'Blanco', 'Rosado']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'No Aplica'>;
  };
}

export interface ApiPromocionPromocion extends Struct.CollectionTypeSchema {
  collectionName: 'promociones';
  info: {
    displayName: 'Promociones';
    pluralName: 'promociones';
    singularName: 'promocion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    coupon: Schema.Attribute.Component<'coupon.coupon', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::promocion.promocion'
    > &
      Schema.Attribute.Private;
    promotion: Schema.Attribute.Component<'promocion.promocion', false>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPuntosDeVentaPuntosDeVenta extends Struct.SingleTypeSchema {
  collectionName: 'puntos_de_ventas';
  info: {
    description: '';
    displayName: 'Puntos de Venta';
    pluralName: 'puntos-de-ventas';
    singularName: 'puntos-de-venta';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    image: Schema.Attribute.Media<'images'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::puntos-de-venta.puntos-de-venta'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    store: Schema.Attribute.Component<'punto-de-venta.punto-de-venta', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiReglaPlanReglaPlan extends Struct.CollectionTypeSchema {
  collectionName: 'reglas_planes';
  info: {
    description: '';
    displayName: 'Reglas Planes';
    pluralName: 'reglas-planes';
    singularName: 'regla-plan';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::regla-plan.regla-plan'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    plans: Schema.Attribute.Relation<'manyToMany', 'api::plan.plan'>;
    publishedAt: Schema.Attribute.DateTime;
    Reglas: Schema.Attribute.DynamicZone<
      [
        'reglas.regla-rango-de-fecha',
        'reglas.rango-de-hora',
        'reglas.dia-restringido',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 1;
          min: 1;
        },
        number
      >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiReglamentoReglamento extends Struct.SingleTypeSchema {
  collectionName: 'reglamentos';
  info: {
    description: '';
    displayName: 'Reglamento';
    pluralName: 'reglamentos';
    singularName: 'reglamento';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    image: Schema.Attribute.Media<'images'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::reglamento.reglamento'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiReservaReserva extends Struct.CollectionTypeSchema {
  collectionName: 'reservas';
  info: {
    description: '';
    displayName: 'Reservas';
    pluralName: 'reservas';
    singularName: 'reserva';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    check_in_status: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    creationDate: Schema.Attribute.DateTime;
    customerDocument: Schema.Attribute.String & Schema.Attribute.Required;
    customerDocumentType: Schema.Attribute.Enumeration<
      ['C\u00E9dula', 'C\u00E9dula de extranjer\u00EDa', 'NIT', 'Pasaporte']
    >;
    customerEmail: Schema.Attribute.Email & Schema.Attribute.Required;
    customerIpAddress: Schema.Attribute.String;
    customerLastname: Schema.Attribute.String & Schema.Attribute.Required;
    customerMiddleName: Schema.Attribute.String;
    customerName: Schema.Attribute.String & Schema.Attribute.Required;
    customerPhone: Schema.Attribute.String;
    customerSecondLastname: Schema.Attribute.String;
    guests: Schema.Attribute.Integer & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::reserva.reserva'
    > &
      Schema.Attribute.Private;
    payment_id: Schema.Attribute.String;
    payment_method: Schema.Attribute.String;
    payment_status: Schema.Attribute.Enumeration<
      ['Pendiente', 'Pago', 'Fallido', 'approved', 'rejected']
    >;
    pedidos: Schema.Attribute.Relation<'manyToMany', 'api::pedido.pedido'>;
    plan: Schema.Attribute.Relation<'manyToOne', 'api::plan.plan'>;
    publishedAt: Schema.Attribute.DateTime;
    reservationDate: Schema.Attribute.Date & Schema.Attribute.Required;
    reservationNumber: Schema.Attribute.String & Schema.Attribute.Unique;
    reservationTime: Schema.Attribute.Time & Schema.Attribute.Required;
    servicios_adicionale: Schema.Attribute.Relation<
      'manyToOne',
      'api::additional-service.additional-service'
    >;
    sheetSynced: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    state: Schema.Attribute.Enumeration<
      ['Pendiente', 'Confirmada', 'Cancelada', 'Pago']
    >;
    totalPriceReservation: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user_agent: Schema.Attribute.String;
    users_permissions_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiTerminoYCondicionTerminoYCondicion
  extends Struct.SingleTypeSchema {
  collectionName: 'terminos_y_condiciones';
  info: {
    description: '';
    displayName: 'T\u00E9rminos y condiciones';
    pluralName: 'terminos-y-condiciones';
    singularName: 'termino-y-condicion';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    image: Schema.Attribute.Media<'images'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::termino-y-condicion.termino-y-condicion'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiVariacionVariacion extends Struct.CollectionTypeSchema {
  collectionName: 'variaciones';
  info: {
    description: '';
    displayName: 'Variaciones';
    pluralName: 'variaciones';
    singularName: 'variacion';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    image: Schema.Attribute.Media<'images'>;
    isActive: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::variacion.variacion'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    productos: Schema.Attribute.Relation<
      'manyToMany',
      'api::producto.producto'
    >;
    publishedAt: Schema.Attribute.DateTime;
    SKU: Schema.Attribute.UID;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    variationAttributes: Schema.Attribute.Component<
      'atributos-ecommerce.atributo',
      true
    >;
    variationPrice: Schema.Attribute.Integer;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.String;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.String;
    allowMarketing: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    bornDate: Schema.Attribute.Date;
    city: Schema.Attribute.String;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    department: Schema.Attribute.String;
    document: Schema.Attribute.String;
    documentType: Schema.Attribute.Enumeration<
      ['C\u00E9dula', 'C\u00E9dula de extranjer\u00EDa', 'Pasaporte', 'NIT']
    > &
      Schema.Attribute.Required;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstName: Schema.Attribute.String;
    gender: Schema.Attribute.Enumeration<['Masculino', 'Femenino', 'Otro']>;
    lastName: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    middleName: Schema.Attribute.String;
    mobile: Schema.Attribute.BigInteger;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    pedidos: Schema.Attribute.Relation<'oneToMany', 'api::pedido.pedido'>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    reservas: Schema.Attribute.Relation<'oneToMany', 'api::reserva.reserva'>;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    secondLastName: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::session': AdminSession;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::additional-service.additional-service': ApiAdditionalServiceAdditionalService;
      'api::advertencia-y-recomendacion.advertencia-y-recomendacion': ApiAdvertenciaYRecomendacionAdvertenciaYRecomendacion;
      'api::aviso-de-privacidad.aviso-de-privacidad': ApiAvisoDePrivacidadAvisoDePrivacidad;
      'api::cepa-de-vino.cepa-de-vino': ApiCepaDeVinoCepaDeVino;
      'api::correo.correo': ApiCorreoCorreo;
      'api::el-vinedo.el-vinedo': ApiElVinedoElVinedo;
      'api::experiencia.experiencia': ApiExperienciaExperiencia;
      'api::faq.faq': ApiFaqFaq;
      'api::horario.horario': ApiHorarioHorario;
      'api::menu.menu': ApiMenuMenu;
      'api::nosotro.nosotro': ApiNosotroNosotro;
      'api::pedido.pedido': ApiPedidoPedido;
      'api::plan.plan': ApiPlanPlan;
      'api::politica-dato-personal.politica-dato-personal': ApiPoliticaDatoPersonalPoliticaDatoPersonal;
      'api::popup.popup': ApiPopupPopup;
      'api::product-category.product-category': ApiProductCategoryProductCategory;
      'api::producto.producto': ApiProductoProducto;
      'api::promocion.promocion': ApiPromocionPromocion;
      'api::puntos-de-venta.puntos-de-venta': ApiPuntosDeVentaPuntosDeVenta;
      'api::regla-plan.regla-plan': ApiReglaPlanReglaPlan;
      'api::reglamento.reglamento': ApiReglamentoReglamento;
      'api::reserva.reserva': ApiReservaReserva;
      'api::termino-y-condicion.termino-y-condicion': ApiTerminoYCondicionTerminoYCondicion;
      'api::variacion.variacion': ApiVariacionVariacion;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
