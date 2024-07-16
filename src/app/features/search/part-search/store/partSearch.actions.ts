import { createAction , props} from '@ngrx/store'
import GraphQLRequest from '../../../../components/filter/types/graphQLRequest';
import { PartGraphQLResponsePaged } from '../types/partGraphQLResponsePaged';

export const partSearch = createAction('[PART-SEARCH] Part Search', props<{graphQLRequest: GraphQLRequest}>());
export const partSearchSuccess = createAction('[PART-SEARCH] Part Search Success', props<{response: PartGraphQLResponsePaged}>());
export const partSearchFail = createAction('[PART-SEARCH] Part Search Fail');
