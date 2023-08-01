module.exports = {
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	collectCoverage: true,
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
	testEnvironment: 'node',
	modulePaths: ['<rootDir>/src'],
}
