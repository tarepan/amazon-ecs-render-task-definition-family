## Amazon ECS "Append suffix to family in Task Definition" Action for GitHub Actions

Appending suffix string to `family` property of an Amazon ECS task definition JSON file, creating a new task definition file.  
e.g. `family: hoge` => (append `-fuga` with this action) => `family: hoge-fuga`

**Table of Contents**

<!-- toc -->

- [Amazon ECS "Append suffix to family in Task Definition" Action for GitHub Actions](#amazon-ecs-%22append-suffix-to-family-in-task-definition%22-action-for-github-actions)
- [Usage](#usage)
- [License Summary](#license-summary)

<!-- tocstop -->

## Usage

To append the value `-prod` to family `hoge` in the task definition file, and then register the edited task definition file to ECS:

```yaml
- name: Render appended-family in Amazon ECS task definition
  id: render-family
  uses: tarepan/amazon-ecs-render-task-definition-family@v2
  with:
    task-definition: task-definition.json
    suffix: -prod

- name: Register to Amazon ECS
  uses: tarepan/amazon-ecs-register-task-definition@v2
  with:
    task-definition: ${{ steps.render-family.outputs.task-definition }}
```

See [action.yml](action.yml) for the full documentation for this action's inputs and outputs.

## License Summary

This code is made available under the MIT license.
