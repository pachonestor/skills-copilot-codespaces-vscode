function skillsMember() {
  return {
    restrict: 'E',
    scope: {
      member: '=',
      skills: '='
    },
    templateUrl: 'templates/member.html'
  };
}