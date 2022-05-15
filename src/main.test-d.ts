import partialMerge from 'partial-merge'
import { expectType, expectError } from 'tsd'

expectType<{}>(partialMerge({}, {}))

partialMerge({}, {}, { mutate: true })

expectError(partialMerge({}, {}, true))
expectError(partialMerge({}, {}, { mutate: 1 }))
