locals {
  lambda_configs = {
    test-lambda = {
      handler       = "index.handler"
      runtime       = "nodejs20.x"
      source_path   = "../node/test-lambda/out"
      environment_variables = {
        TEST = "test"
      }
      permissions_policy = {
        Version = "2012-10-17"
        Statement = [
          {
            Action   = ["s3:*"]
            Effect   = "Allow"
            Resource = "*"
          }
        ]
      }
    }
    pay-tax = {
      handler       = "index.handler"
      runtime       = "nodejs20.x"
      source_path   = "../node/pay-tax/out"
      environment_variables = {
        TEST = "test"
      }
      permissions_policy = {
        Version = "2012-10-17"
        Statement = [
          {
            Action   = ["s3:*"]
            Effect   = "Allow"
            Resource = "*"
          }
        ]
      }
    }

  }
}

module "lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "7.7.0" 
  
  for_each = local.lambda_configs

  function_name = each.key
  handler       = each.value.handler
  runtime       = each.value.runtime
  source_path   = each.value.source_path
  publish       = true
  memory_size   = 128
  timeout       = 5
  environment_variables =  each.value.environment_variables
  attach_policy_json = true
  policy_json = jsonencode(each.value.permissions_policy)
}