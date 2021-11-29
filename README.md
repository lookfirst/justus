<p align="center">
  <img src="https://raw.githubusercontent.com/juitnow/justus/main/LOGO.svg" alt="logo">
</p>

JUSTUS
======

> _"**justus**"_ (latin, adj.): _"proper"_ or _"correct"_.

JUSTUS is a very simple library for _validating_ JavaScript objects and
properly _annotating_ them with TypeScript types.

It focuses in providing an _easy_ and _terse_ syntax to define a simple schema,
used to ensure that an object is _**correct**_ and from which _**proper**_
typing can be inferred.

* [Quick Start](#quick-start)
* Validators
  * [Strings](#string-validator)
  * [Numbers](#number-validator)
  * [Booleans](#boolean-validator)
  * [Constants](#constant-validator)
  * [Any](#any-validator)
  * [Arrays](#array-validator)
  * [Dates](#date-validator)
  * [Tuples](#tuple-validator)
  * [Objects](#object-validator)
  * [Any of, all of](#union-validator)
* [Copyright Notice](NOTICE.md)
* [License](LICENSE.md)


Quick Start
-----------

You can use JUSTUS in your projects quite simply: import, write a schema and
validate. For example:

```typescript
import { validate, object, string, number } from 'justus'

// Create a validator, validating _objects_ with a specific schema
const validator = object({

  // The "foo" property in the objects to validate must be a "string"
  // with a minimum length of one character
  foo: string({ minLength: 1 }),

  // The "bar" property in the objects to validate must be a "number"
  bar: number,

// Always use `as const`: it correctly infers types for constants, tuples, ...
} as const)

// Use the validator to validate the object specified as the second argument
const validated = validate(validator, { foo: 'xyz', bar: 123 })

validated.foo // <-- its type will be "string"
validated.bar // <-- its type will be "number"
```

Easy, terse, ultimately very readable... And all types are inferred!

#### Shorthand syntax

The `validate` function (or anywhere a _validation_ is needed) can accept a
_shorthand_ inline syntax. From our example above:

```typescript
const validated = validate({
  foo: string({ minLength: 1 }),
  bar: number,
} as const, {
  foo: 'xyz',
  bar: 123,
})
```

... you get the drill! See below in each _validator_ for their shorthand syntax.


String Validator
----------------

String validators are created using the `string` function:

```typescript
import { string } from 'justus'

const s1 = string() // validates any string
const s2 = string({ minLength: 1 }) // validate non empty strings
```

#### Options

* `minLength?: number`: The _minimum_ length of a valid `string`
* `maxLength?: number`: The _maximum_ length of a valid `string`
* `pattern?: RegExp`: A `RegExp` enforcing a particular pattern for a valid `string`

#### Branded strings

Type _branding_ can be used for string primitives, conveying additional
semantic meaning to the value being validated. For example:

```typescript
type UUID = string & { __brand_uuid: never }

const uuidValidator = string({
  pattern: /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/,
  minLength: 36,
  maxLength: 36,
})

const value = validate(uuidValidator, 'C274773D-1444-41E1-9D3A-9F9D584FE8B5')

value = 'foo' // <- will fail, as "foo" is a `string`, while "value" is a `UUID`
```

#### Shorthand syntax

The shorthand syntax for string validators is simply `string`. For example:

```typescript
const validator = object({
  foo: string // yep, no parenthesis, just "string"
})
```
