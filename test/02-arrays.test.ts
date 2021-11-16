import { ValidationError, validate, array, string } from '../src'
import { expect } from 'chai'

describe('Array validators', () => {
  it('should validate an array', () => {
    expect(validate(array, [ 1, true, 'foo' ])).to.eql([ 1, true, 'foo' ])
    expect(validate(array, [])).to.eql([])

    expect(validate(array(), [ 1, true, 'foo' ])).to.eql([ 1, true, 'foo' ])
    expect(validate(array(), [])).to.eql([])

    expect(() => validate(array, 123))
        .to.throw(ValidationError, 'Found 1 validation error')
        .with.property('errors').to.eql([
          { key: '', message: 'Value is not an "array"' },
        ])
  })

  it('should validate an array of a specified length', () => {
    const length = array({ minItems: 3, maxItems: 6 })
    expect(validate(length, [ 1, 2, 3 ])).to.eql([ 1, 2, 3 ])
    expect(validate(length, [ 1, 2, 3, 4, 5, 6 ])).to.eql([ 1, 2, 3, 4, 5, 6 ])
    expect(() => validate(length, [ 1, 2 ]))
        .to.throw(ValidationError, 'Found 1 validation error')
        .with.property('errors').to.eql([
          { key: '', message: 'Array must have a minimum length of 3' },
        ])
    expect(() => validate(length, [ 1, 2, 3, 4, 5, 6, 7 ]))
        .to.throw(ValidationError, 'Found 1 validation error')
        .with.property('errors').to.eql([
          { key: '', message: 'Array must have a maximum length of 6' },
        ])

    expect(validate(array({ minItems: 3, maxItems: 3 }), [ 1, 2, 3 ])).to.eql([ 1, 2, 3 ])

    expect(() => array({ minItems: -1 }))
        .to.throw(TypeError, 'Constraint "minItems" (-1) must be non-negative')
    expect(() => array({ maxItems: -1 }))
        .to.throw(TypeError, 'Constraint "maxItems" (-1) must be non-negative')
    expect(() => array({ minItems: 4, maxItems: 3 }))
        .to.throw(TypeError, 'Constraint "minItems" (4) is greater than "maxItems" (3)')
  })

  it('should validate an array with unique items', () => {
    expect(validate(array(), [ 1, 2, 1 ])).to.eql([ 1, 2, 1 ])
    expect(validate(array({ uniqueItems: false }), [ 1, 2, 1 ])).to.eql([ 1, 2, 1 ])

    expect(() => validate(array({ uniqueItems: true }), [ 1, 2, 1, 2 ]))
        .to.throw(ValidationError, 'Found 2 validation errors')
        .with.property('errors').to.eql([
          { key: '[2]', message: 'Duplicates item at index 0' },
          { key: '[3]', message: 'Duplicates item at index 1' },
        ])
  })

  it('should validate an array with items of a specific type', () => {
    expect(validate(array({ items: string }), [ 'a', 'b', 'c' ])).to.eql([ 'a', 'b', 'c' ])

    expect(() => validate(array({ items: string }), [ 'a', true, 'b', 123 ]))
        .to.throw(ValidationError, 'Found 2 validation errors')
        .with.property('errors').to.eql([
          { key: '[1]', message: 'Value is not a "string"' },
          { key: '[3]', message: 'Value is not a "string"' },
        ])
  })
})
