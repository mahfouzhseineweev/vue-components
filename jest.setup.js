global.mocks = {
    $cookies: {
        get: jest.fn(),
        set: jest.fn(),
        remove: jest.fn()
    },
    $t: jest.fn(),
    $i18n: jest.fn(),
    $route: {
        query: jest.fn()
    },
    $axios: {
        post: jest.fn().mockResolvedValue({ data: 'success' }),
        put: jest.fn().mockResolvedValue({ data: 'success' })
    }
};