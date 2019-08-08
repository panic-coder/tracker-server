module.exports = {
    jwtExpirationPeriod: '24h',
    stagingUrl: 'https://fundoopush-backend-dev.bridgelabz.com/post/', // 'http://localhost:4200/',
    stagingUrlImage: 'https://fundoopush-backend-dev.bridgelabz.com/',
    redirectUrl: process.env.NODE_ENV === "staging" ? 'http://fundoopush-backend-dev.bridgelabz.com/post/' : 'http://fundoopush.bridgelabz.com/post/',
    productionUrl: 'http://fundoopush.bridgelabz.com/post/',
    productionUrlImage: 'http://fundoopush.bridgelabz.com:3001/',
    imagesStoragePath: 'images/',
    imageLinkServerURL: process.env.NODE_ENV === "staging" ? 'http://fundoopush-backend-dev.bridgelabz.com/' : 'http://fundoopush.bridgelabz.com/',
    addUTCHours: 5,
    addUTCMinutes: 30,
    randomStringGenerator: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijhklmnopqrstuvwxyz',
    unix32milliSeconds: 900000,
    cloudFrontUrl: 'https://d3esiao42e00bm.cloudfront.net/',
    youtubeEmbed: 'https://www.youtube.com/embed/',
    smsBodyTemplate: {
        otpSMSBody: 'Your Verification Code is ',
        newOtpSMSBody: `<%23> Your Verification code is: <Code> /CsEYfTxhCS7`,
    },
    emailTemplate: {
        emailSubject: `New <user> User Signup`,
        resetPasswordEmailSubject: `Password reset request`,
        resetPasswordEmailBody: `Hi

        Your reset password request is placed successfully.
        
        Please click on this <link> to change your password.
        
        fundooPush Team`,

        changePasswordEmailSubject: `Password change update`,
        changePasswordEmailBody: `Hi

        Your password has been changed successfully.
        
        Your new login password is - <password>.
        
        fundooPush Team`,
        resetChangePasswordEmailSubject: `Password Reset`,
        resetChangePasswordEmailBody: `Hi

        Your password has been reset.
        
        Your new login password is - <password>.
        
        fundooPush Team`,

        hireNowBL: `
            Hi,

            Name: <Name>
            Email: <PhoneNumber>
            OrganizationName: <OrganizationName>
            TechnologyStack: <TechnologyStack>
            NoOfEngineers: <NoOfEngineers>
            PublicIp: <PublicIp>
            City: <City>
            State: <State>
            Date: <Date>
            
            Thanks,
            Bridgelabz Team`,
        callbackApiBL: `
            Hi,
            
            Name: <Name>
            PhoneNumber: <PhoneNumber>
            OrganizationName: <OrganizationName>
            TechnologyStack: <TechnologyStack>
            NoOfEngineers: <NoOfEngineers>
            DateOfCall: <DateOfCall>
            TimeOfCall: <StartTimeOfCall>
            PublicIp: <PublicIp>
            City: <City>
            State: <State>
            Date: <Date>

            Thanks,
            Bridgelabz Team`,
        hireNowBLSubject: `Hire Now`,
        callbackApiBLSubject: `Request Call Back - Form`
    },
    staticHTTPErrorMessages: {
        INTERNAL_SERVER_ERROR: {
            errorCategory: 'INTERNAL SERVER ERROR',
            errorResponseCode: 500,
            errorResponseMessage: 'Unexpected internal server error.',
        },
        MULTIPLE_CHOICES: {
            errorCategory: 'MULTIPLE CHOICES',
            errorResponseCode: 300,
            errorResponseMessage: 'The requested resource corresponds to any one of a set of representations, each with its own specific location.',
        },
        MOVED_PERMANENTLY: {
            errorCategory: 'MOVED PERMANENTLY',
            errorResponseCode: 301,
            errorResponseMessage: 'The resource has moved permanently. Please refer to the documentation.',
        },
        NOT_MODIFIED: {
            errorCategory: 'NOT MODIFIED',
            errorResponseCode: 304,
            errorResponseMessage: 'The resource is available and not modified.',
        },
        UNAUTHORIZED: {
            errorCategory: 'UNAUTHORIZED',
            errorResponseCode: 401,
            errorResponseMessage: 'You are unauthorized to access the requested resource. Please log in.',
        },
        BAD_REQUEST: {
            errorCategory: 'BAD REQUEST',
            errorResponseCode: 400,
            errorResponseMessage: 'Invalid syntax for this request was provided.',
        },
        FORBIDDEN: {
            errorCategory: 'FORBIDDEN',
            errorResponseCode: 403,
            errorResponseMessage: 'Your account is not authorized to access the requested resource.',
        },
        NOT_FOUND: {
            errorCategory: 'NOT FOUND',
            errorResponseCode: 404,
            errorResponseMessage: 'We could not find the resource you requested. Please refer to the documentation for the list of resources.',
        },
        CONFLICT: {
            errorCategory: 'CONFLICT',
            errorResponseCode: 409,
            errorResponseMessage: 'The request could not be completed due to a conflict with the current state of the resource.',
        }
    },
    staticHTTPSuccessMessages: {
        OK: {
            successCategory: 'OK',
            successResponseCode: 200,
            successResponseMessage: 'The request has succeeded.',
        },
        CREATED: {
            successCategory: 'CREATED',
            successResponseCode: 201,
            successResponseMessage: 'The request has been fulfilled and resulted in a new resource being created.',
        }
    }

}
