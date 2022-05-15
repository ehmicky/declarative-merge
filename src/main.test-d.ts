import notDeepMerge from 'not-deep-merge'
import { expectType, expectError } from 'tsd'

expectType<{}>(notDeepMerge({}, {}))

notDeepMerge({}, {}, { mutate: true })

expectError(notDeepMerge({}, {}, true))
expectError(notDeepMerge({}, {}, { mutate: 1 }))
