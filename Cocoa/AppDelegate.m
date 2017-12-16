#import "AppDelegate.h"
#import "ViewController.h"

@implementation AppDelegate

- (BOOL) application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
	UIViewController *rootViewController = [[ViewController alloc] init];

	[self setWindow: [[UIWindow alloc] initWithFrame: [[UIScreen mainScreen] bounds]]];
	[[self window] setBackgroundColor: UIColor.whiteColor];
	[[self window] setRootViewController: rootViewController];
	[[self window] makeKeyAndVisible];

	return YES;
}

- (void) applicationWillResignActive:(UIApplication *)application {}
- (void) applicationDidEnterBackground:(UIApplication *)application {}
- (void) applicationWillEnterForeground:(UIApplication *)application {}
- (void) applicationDidBecomeActive:(UIApplication *)application {}
- (void) applicationWillTerminate:(UIApplication *)application {}

@end
