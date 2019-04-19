import { jsonToGraphQLQuery } from 'json-to-graphql-query';

/**
 * GraphQL request type
 */
export enum GraphQLType {
  QUERY = 'query',
  MUTATION = 'mutation',
  SUBSCRIPTION = 'subscription',
}

/**
 * GraphQL fields
 */
export type Fields = string | string[] | FieldArray;

/**
 * GraphQL fields
 */
export interface FieldArray extends Array<Fields> {}

/**
 * GraphQL request config
 */
export interface GraphQLConfig {

  /**
   * GraphQL arguments
   * https://graphql.org/learn/queries/#arguments
   */
  arguments?: {[key: string]: any};

  /**
   * GraphQL fields
   * https://graphql.org/learn/queries/#fields
   */
  fields?: string[];

  /**
   * Name of the request type
   */
  name?: string;

  /**
   * GraphQL request type
   * https://graphql.org/learn/queries
   */
  type?: GraphQLType;
}

/**
 * Test helper
 */
export class TestHelper {
  app: any;

  /**
   * Constructor
   */
  constructor(app: any) {
    this.app = app;
  }

  /**
   * GraphQl
   * @param graphql String or GraphQLConfig, if string then it is a name or a query
   * @param statusCode Status code of response
   */
  async graphQl(graphql: string | GraphQLConfig  = {}, statusCode: number = 200): Promise<any> {

    let query: string = '';
    let args: boolean = false;

    // Convert string to GraphQLConfig
    if ((typeof graphql === 'string' || graphql instanceof String) && /^[a-zA-Z]+$/.test(graphql as string)) {

      // Use input as query
      query = graphql as string;
    } else {

      // Use input as name
      if (typeof graphql === 'string' || graphql instanceof String) {
        graphql = {name: graphql} as any;
      }

      // Prepare config
      graphql = Object.assign({arguments: null, fields: ['id'], name: null, type: GraphQLType.QUERY}, graphql) as GraphQLConfig;

      const queryObj = {};
      queryObj[graphql.type] = {};
      queryObj[graphql.type][graphql.name] = {};
      if (graphql.arguments) {
        args = true;
        queryObj[graphql.type][graphql.name].__args = graphql.arguments;
      }
      if (graphql.fields && graphql.fields.length > 0) {
        for (const key of graphql.fields) {
          queryObj[graphql.type][graphql.name][key] = true;
        }
      }

      // Create request payload query
      query = jsonToGraphQLQuery(queryObj, {pretty: true});
    }

    // Response
    const response =  await this.app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {query},
    });

    expect(response.statusCode).toBe(statusCode);
    expect(response.headers['content-type']).toBe('application/json');

    // return data
    return args && JSON.parse(response.body).data ? JSON.parse(response.body).data[(graphql as GraphQLConfig).name] : JSON.parse(response.body);
  }

  /**
   * Convert array to string
   * @param fields
   */
  arrayToFields(fields: Fields): string {
    if (Array.isArray(fields)) {
      fields = (fields as any).map((field) => this.arrayToFields(field));
      fields = `{ ${fields.toString()} }`;
    }
    return fields;
  }
}
