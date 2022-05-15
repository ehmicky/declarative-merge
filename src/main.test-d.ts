import partialMerge from 'partial-merge'
import { expectType, expectError } from 'tsd'

expectType<{}>(partialMerge({}, {}))

expectError(partialMerge({}, {}, {}))
