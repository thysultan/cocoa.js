#import "ViewController.h"
#import "JavaScriptController.h"

@implementation ViewController
- (void) viewDidLoad {
		[JavaScriptController require: @"index"];
}
@end
