import { validate } from 'class-validator';
import { ClassConstructor, plainToClassFromExist } from 'class-transformer';


export enum EValidateFields {
    BODY = 'body',
    QUERY = 'query'
}

type validateType = EValidateFields.BODY | EValidateFields.QUERY;

export function ValidateDto(dtoClass: ClassConstructor<any>, type: validateType = EValidateFields.BODY): MethodDecorator {

    return function (target: any, key: string, descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {

            const ctx = args[0];
            const sourceData = type === EValidateFields.BODY ? ctx.request.body : ctx.request.query;
            const dto = plainToClassFromExist(new dtoClass(), sourceData);
            const errors = await validate(dto);


            if (errors.length > 0) {

                const errorMsg = getErrorMsg(errors);

                ctx.body = {
                    code: 400,
                    data: errorMsg,
                    msg: 'fail'
                };

                return;
            }

            if (type === EValidateFields.BODY) {
                ctx.request.body = dto;
            } else {
                ctx.request.query = dto;
            }

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}


export function getErrorMsg(errors: any[]) {

    const { property, constraints } = errors?.[0];
    const propertyKey = Object.keys(constraints)?.[0];

    return `${property}: ${constraints?.[propertyKey]}`;

}