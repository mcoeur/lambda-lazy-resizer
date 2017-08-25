# Lambda lazy resizer

This lambda function resizes images stored on an AWS S3 on-the-fly then redirects to the resized image.

Use in combination with AWS API Gateway (and S3 Conditional Redirects).

Based on https://github.com/awslabs/serverless-image-resizing and modified to accomodate my needs



# Usage

1. Upload the file `dist/lambda_function.zip` file to your lambda function
2. Create the following environment variables :

| Key | Value | Exemple |
|---|---|---|
| BUCKET | String | my-aws-s3-bucket |
| WHITELISTED_SIZED | String - Separated with the character \| | 800x600\|400\|x300 |
| WHITELISTED_FORMATS| String - Separated with the character \| | jpeg\|png |
| URL | String - Url to redirect to when the image is resized| http://my-amazon-s3-bucket-link.com |

3. Publish your lambda function

# Testing and development

To try out the lambda function locally, just run `node test.js` and navigate to `http://localhost:3000/:size/:fileName` where FileName is the name of a file hosted on your S3 bucket