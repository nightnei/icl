import {
    Request,
    Response,
} from 'express';
import Joi from '@hapi/joi';
import _ from 'lodash/fp';

import db from '../../db';
import validateRequestFactory from '../../common/services/validateRequest';
import {
    appNameSchema,
} from '../interfaces';

type DeleteAppRequestParams = {
    name: string,
};

const validateRequestBeforeDeleteApp = validateRequestFactory([{
    schema: Joi.object({
        name: appNameSchema.required(),
    }),
    selector: _.get('params'),
}]);

const deleteApp = async (req: Request<DeleteAppRequestParams>, res: Response): Promise<void> => {
    await validateRequestBeforeDeleteApp(req, res);

    const appName = req.params.name;

    await db('apps').where('name', appName).delete();

    res.status(200).send();
};

export default deleteApp;
