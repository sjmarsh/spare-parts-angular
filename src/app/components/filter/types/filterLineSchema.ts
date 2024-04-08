import * as Yup from 'yup';

const FilterLineSchema = Yup.object().shape({
    selectedField: Yup.object().required().label('Field'),
    selectedOperator: Yup.string().required().label('Operator'),
    value: Yup.string().required().label('Value')
});

export default FilterLineSchema;