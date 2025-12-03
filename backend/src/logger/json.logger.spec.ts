import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  describe('log', () => {
    it('вызывает console.log с верными параметрами', () => {
      const message = 'log message';
      const params = ['param-1', 'param-2'];

      logger.log(message, ...params);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /^{"level":"log","message":"log message","optionalParams":\[\["param-1","param-2"\]\]}$/,
        ),
      );
    });
  });

  describe('error', () => {
    it('вызывает console.error с верными параметрами', () => {
      const message = 'error message';

      logger.error(message);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /^{"level":"error","message":"error message","optionalParams":\[\[\]\]}$/,
        ),
      );
    });
  });

  describe('warn', () => {
    it('вызывает console.warn с верными параметрами', () => {
      const message = 'warn message';

      logger.warn(message);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /^{"level":"warn","message":"warn message","optionalParams":\[\[\]\]}$/,
        ),
      );
    });
  });

  describe('debug', () => {
    it('вызывает console.debug с верными параметрами', () => {
      const message = 'debug message';

      logger.debug(message);

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /^{"level":"debug","message":"debug message","optionalParams":\[\[\]\]}$/,
        ),
      );
    });
  });

  describe('verbose', () => {
    it('вызывает console.log с верными параметрами', () => {
      const message = 'verbose message';

      logger.verbose(message);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /^{"level":"verbose","message":"verbose message","optionalParams":\[\[\]\]}$/,
        ),
      );
    });
  });
});