const rules = {
	visitor: {
		static: ["jobs:list", "home-page:visit"]
	},
	jobseeker: {
		static: [
			"jobs:list",
			"jobs:create",
			"users:getSelf",
			"home-page:visit",
			"dashboard-page:visit"
		],
		dynamic: {
			"jobs:edit": ({
				userId,
				jobOwnerId
			}) => {
				if (!userId || !jobOwnerId) return false;
				return userId === jobOwnerId;
			}
		}
	},
	admin: {
		static: [
			"jobs:list",
			"jobs:create",
			"jobs:edit",
			"jobs:delete",
			"users:get",
			"users:getSelf",
			"home-page:visit",
			"dashboard-page:visit"
		]
	}
};

export default rules;
