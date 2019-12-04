import {
    Request,
    Response,
} from 'express';
import Joi from '@hapi/joi';
import _ from 'lodash/fp';

import db from '../../db';
import validateRequestFactory from '../../common/services/validateRequest';
import preProcessResponse from '../../common/services/preProcessResponse';
import {
    stringifyJSON,
} from '../../common/services/json';
import {
    appNameSchema,
    partialAppSchema,
} from '../interfaces';

type UpdateAppRequestParams = {
    name: string
};

const validateRequestBeforeUpdateApp = validateRequestFactory([
    {
        schema: Joi.object({
            name: appNameSchema.required(),
        }),
        selector: _.get('params'),
    },
    {
        schema: partialAppSchema,
        selector: _.get('body')
    },
]);

const updateApp = async (req: Request<UpdateAppRequestParams>, res: Response): Promise<void> => {
    await validateRequestBeforeUpdateApp(req, res);

    const app = req.body;
    const appName = req.params.name;

    const countToUpdate = await db('apps').where({ name: appName })
    if (!countToUpdate.length) {
        res.status(404).send('Not found');
        return;
    }

    await db('apps').where({ name: appName }).update(stringifyJSON(['dependencies', 'props', 'ssr', 'initProps'], app));

    const [updatedApp] = await db.select().from('apps').where('name', appName);

    res.status(200).send(preProcessResponse(updatedApp));
};

export default updateApp;
