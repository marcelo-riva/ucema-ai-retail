# AWS Future Spec

## Objetivo

Implementar bajo costo y bajo mantenimiento.

## Servicios

- Frontend: Amplify Hosting o S3 + CloudFront.
- Auth: Cognito User Pool.
- API: API Gateway HTTP API.
- Compute: Lambda.
- Metadata: DynamoDB on-demand.
- Files: S3.
- Logs: CloudWatch con retención 7 días.

## Evitar

- NAT Gateway.
- RDS en MVP.
- ECS/Fargate always-on.
- OpenSearch.
- Procesamiento continuo.

## DynamoDB tablas sugeridas

- `Groups`
- `Labs`
- `Exercises`
- `Submissions`
- `StateVersions`
- `Scoreboards`

## S3 estructura

```text
s3://nexus-retail-labs-{stage}/
  master/
  groups/{group_id}/labs/{lab_id}/states/
  groups/{group_id}/labs/{lab_id}/submissions/
  groups/{group_id}/labs/{lab_id}/exports/
```
