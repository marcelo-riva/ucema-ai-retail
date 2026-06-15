# CODEX PROMPT 05 — AWS IaC plan

Preparar una carpeta de infraestructura para AWS, pero no desplegar todavía.

## Ubicación

`laboratorio_v3/infra/aws`

## Objetivo

Dejar listo un plan de IaC usando CDK o Terraform.

## Servicios

- Amplify Hosting o S3 + CloudFront para frontend.
- Cognito User Pool.
- API Gateway HTTP API.
- Lambda para API.
- DynamoDB on-demand.
- S3 para archivos.
- CloudWatch logs con retención de 7 días.

## Restricciones

- No NAT Gateway.
- No RDS.
- No servicios always-on.
- No OpenSearch.
- Todo parametrizable por stage: `dev`, `prod`.

## Outputs esperados

- Frontend URL.
- API URL.
- S3 bucket.
- Cognito User Pool ID.
- Cognito Client ID.

## Entregable

- README de arquitectura AWS.
- Diagrama textual.
- Lista de recursos.
- Variables necesarias.
- Comandos de deploy.
