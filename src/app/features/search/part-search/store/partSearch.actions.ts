import { createAction , props} from '@ngrx/store'
import FilterGridState from '../../../../components/filter/types/filterGridState';
import GraphQLRequest from '../../../../components/filter/types/graphQLRequest';
import Part from '../../../parts/types/Part';
import { PartGraphQLResponsePaged } from '../types/partGraphQLResponsePaged';

export const partSearch = createAction('[PART-SEARCH] Part Search', props<{graphQLRequest: GraphQLRequest}>());
export const partSearchSuccess = createAction('[PART-SEARCH] Part Search Success', props<{response: PartGraphQLResponsePaged}>());
export const partSearchFail = createAction('[PART-SEARCH] Part Search Fail');

export const updateFilterGridState = createAction('[PART-SEARCH] Update FilterGrid State', props<{updatedState: FilterGridState<Part>}>());