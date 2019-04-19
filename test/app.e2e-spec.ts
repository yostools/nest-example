import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { GraphQLType, TestHelper } from './test.helper';

describe('AppController (e2e)', () => {
  let app;
  let testHelper: TestHelper;

  // ===================================================================================================================
  // Preparations
  // ===================================================================================================================

  /**
   * Before all tests
   */
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter());
    await app.init();
    testHelper = new TestHelper(app);
  });

  /**
   * After all tests are finished
   */
  afterAll(() => {
    app.close();
  });

  // ===================================================================================================================
  // Tests
  // ===================================================================================================================

  /**
   * Create User
   */
  it('createUser', async () => {
    const res: any = await testHelper.graphQl({
      type: GraphQLType.MUTATION, name: 'createUser', arguments: { input: { email: 'test@test.de' } }, fields: ['id', 'email'],
    });
    expect(res.email).toBe('test@test.de');
  });

  /**
   * Get User
   */
  it('getUser', async () => {
    const res: any = await testHelper.graphQl({
      type: GraphQLType.QUERY, name: 'getUser', arguments: { id: 'User0' }, fields: ['id', 'email'],
    });
    expect(res.id).toBe('User0');
    expect(res.email).toBe('test@test.de');
  });
});
