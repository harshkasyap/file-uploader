import { Request, Response } from 'express';
import { RequestContext } from '../request-context';
import { OK } from 'http-status-codes';
import * as t from 'io-ts';
import { parse } from '../../utils/parse-utils';
import { pipe } from '../../utils/stream-utils';

interface RouteParams {
    filename: string;
}

const routeParamsValidator: t.Type<RouteParams> = t.type({
    filename: t.string
}, 'route');

export async function downloadFile(req: Request, res: Response, context: RequestContext) {
    const params = parse(req.params, routeParamsValidator);

    const sanitizedFileName = encodeURIComponent(params.filename);

    const reader = await context.fileRepository.getFileReader(sanitizedFileName);
    res.header('Content-Disposition', `attachment; filename="${encodeURIComponent(params.filename)}"`).status(OK);
    await pipe(reader, res);
}
