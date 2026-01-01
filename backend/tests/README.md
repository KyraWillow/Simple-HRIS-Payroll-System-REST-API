# Testing Documentation

## Folder Structure
```
tests/
├── unit/                 # Unit tests
│   ├── entities/         # Entity tests
│   ├── usecases/         # Use case tests
│   └── repositories/     # Repository tests
├── integration/          # Integration tests
├── e2e/                 # End-to-end tests
├── mocks/               # Mock objects
└── fixtures/            # Test data fixtures
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Debug Mode
```bash
npm run test:debug
```

## Writing Tests

### Unit Tests
- Test individual components in isolation
- Use mocks to replace dependencies
- Focus on business logic

### Integration Tests
- Test multiple components working together
- May use real or mock databases
- Focus on data flow

### Best Practices
- Use descriptive test names
- Test both positive and negative cases
- Mock external dependencies
- Keep tests independent