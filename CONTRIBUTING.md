# Contributing to LODMAP2D

Contributions to this project are always welcome. You make our lives easier by
sending us your contributions through pull requests.

Pull requests for bug fixes must be based on the current stable branch whereas
pull requests for new features must be based on `master`.



## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a 
   build.
2. Update the README.md with details of changes to the interface, this includes new environment 
   variables, exposed ports, useful file locations and container parameters.
3. Edit [unreleased] tag in CHANGELOG.md and save your changes, additions, fix and delete to what this version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.

We are trying to follow the [PHP-FIG](http://www.php-fig.org)'s standards, so
when you send us a pull request, be sure you are following them.

Please see http://help.github.com/pull-requests/.

We kindly ask you to add following sentence to your pull request:

“I hereby assign copyright in this code to the project, to be licensed under the same terms as the rest of the code.”


Before submitting a pull request clean your code and test it

```
HERE INSTRUCTION TO EXECUTE TESTS
```



## Publish image to dockerhub

This process generates a new docker image that configure and runs a stand-alone nginx server:

```
docker build  -t linkeddatacenter/lodmap2d -f docker/Dockerfile .
docker tag linkeddatacenter/lodmap2d linkeddatacenter/lodmap2d:x.y.z
docker push linkeddatacenter/lodmap2d
```

