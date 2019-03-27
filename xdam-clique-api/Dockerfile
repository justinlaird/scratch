FROM node:10
USER root
WORKDIR /app
COPY . /app

## this is purely for ECS manual task creation and running.
CMD ["sh", "bin/startup"]

## For my feature self and our team, regarding deployment to ECS ##
#
# Summary - pr that includes this comment as last commit, uses ECR as input
# artifact to deploy step of codepipeline, the other options are mentioned below
#
# 5 ways to do it :) of course!
#
# 1. cloudformation stack update (dont know enough to comment atm tbh)
# 2. code deploy appspec.yml (see commit made with this note for that setup,
#   and change the deploy stage of codepipeline to use CodeDeploy, which will
#   in turn require appspec.yml - unregister and re-register ec2 instances from
#   autoscaling group, @see https://acloud.guru/course/aws-codedeploy/ advanced v3)
#   for how to do this
# 3. ECR (current enabled) - imagedefinitions.json file will be pulled, we then
#    use the latest tagged (via git sha) version of the pushed container to ECR,
#    which is built within code build. The downside is its very
#    dependent on health check and startup waiting period timeouts and b/c of that,
#    placing the instances that auto-scale into the ALB is disabled, otherwise you
#    end up with a ton of churn and tons of instances, which is where manual use of
#    beforeInstall and afterInstall hooks of CodeDeploy come in clutch - they allow
#    you to deal with this manually, but require a more complex setup, more details, see course link.
# 4. Elastic Beanstalk, (oldest style, works for simpler apps, not recommended for custom apps stacks)
# 5. AWS Service Deploy - seems broken in many ways - 'ECS Service' tag on github
#    ECS agent repo issue list comes up a lot, example https://github.com/aws/amazon-ecs-agent/issues/1421)
#
# Tl;dr - for myself and for the project, CodeDeploy is truly amazing, but ECR artifact
# won in the pr with this last commit. I thus removed codedeploy related files
# so we don't have dead code. Also, the use of codedeploy is rather difficult
# without the course linked above for the rest of team. When we experience some
# pain of ECR artifacts, or I feel frisky again about playing with this stuff again,
# then we'll move that direction, with good docs. Cloudformation is also an option,
# with templates and mocros, it's probably the best but most complicated. TBD.
#
##
